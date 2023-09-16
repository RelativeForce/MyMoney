using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities
{
   public class Transaction : UserFilteredEntity, IRecurringChildEntity
   {
      public DateTime Date { get; set; }

      [Required]
      [MaxLength(Constants.MaxNameLength)]
      public string Description { get; set; }

      [Required]
      [MaxLength(Constants.MaxNotesLength)]
      public string Notes { get; set; }

      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      public long? ParentId { get; set; } = null;

      [ForeignKey(nameof(ParentId))]
      public virtual RecurringTransaction Parent { get; set; }

      [NotMapped]
      public IQueryable<Budget> Budgets => BudgetsProxy.Select(tb => tb.Budget).AsQueryable();
      public virtual ICollection<TransactionBudget> BudgetsProxy { get; set; } = new List<TransactionBudget>();

      [NotMapped]
      public IQueryable<Income> Incomes => IncomesProxy.Select(tb => tb.Income).AsQueryable();
      public virtual ICollection<TransactionIncome> IncomesProxy { get; set; } = new List<TransactionIncome>();

      public void UpdateBudgets(IRepository repository, IRelationRepository relationRepository, long[] budgetIds)
      {
         DeleteAllBudgets(relationRepository);

         var budgets = repository
            .UserFiltered<Budget>(UserId)
            .Where(b => budgetIds.Contains(b.Id))
            .ToList();

         foreach (var budget in budgets)
         {
            relationRepository.Add(new TransactionBudget(this, budget));
         }
      }

      public void UpdateIncomes(IRepository repository, IRelationRepository relationRepository, long[] incomeIds)
      {
         DeleteAllIncomes(relationRepository);

         var incomes = repository
            .UserFiltered<Income>(UserId)
            .Where(b => incomeIds.Contains(b.Id))
            .ToList();

         foreach (var income in incomes)
         {
            relationRepository.Add(new TransactionIncome(this, income));
         }
      }

      public void DeleteAllBudgets(IRelationRepository relationRepository)
      {
         foreach (var budget in BudgetsProxy.ToList())
         {
            relationRepository.Delete(budget);
         }
      }

      public void DeleteAllIncomes(IRelationRepository relationRepository)
      {
         foreach (var income in IncomesProxy.ToList())
         {
            relationRepository.Delete(income);
         }
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Transaction>().HasIndex(t => new { t.UserId, t.Date, t.Description }).IsUnique();
         model.Entity<Transaction>().HasOne(t => t.User).WithMany().IsRequired();
         model.Entity<Transaction>().HasOne(t => t.Parent).WithMany(rt => rt.RealChildren).IsRequired(false);
      }
   }
}
