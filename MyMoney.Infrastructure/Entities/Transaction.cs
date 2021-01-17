using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities
{
   public class Transaction : UserFilteredEntity, ITransaction
   {
      public DateTime Date { get; set; }
      [Required]
      public string Description { get; set; }
      [Required]
      public string Notes { get; set; }
      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }
      public long? ParentId { get; set; } = null;

      [NotMapped]
      public IRecurringTransaction Parent
      {
         get => ParentProxy;
         set => ParentProxy = value as RecurringTransaction;
      }

      [ForeignKey(nameof(ParentId))]
      public virtual RecurringTransaction ParentProxy { get; set; } = null;

      [NotMapped]
      public IQueryable<IBudget> Budgets => BudgetsProxy.Select(tb => tb.Budget).Cast<IBudget>().AsQueryable();
      public virtual ICollection<TransactionBudget> BudgetsProxy { get; set; } = new List<TransactionBudget>();

      [NotMapped]
      public IQueryable<IIncome> Incomes => IncomesProxy.Select(tb => tb.Income).Cast<IIncome>().AsQueryable();
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
         model.Entity<Transaction>().HasOne(t => t.UserProxy).WithMany().IsRequired();
         model.Entity<Transaction>().HasOne(t => t.ParentProxy).WithMany().IsRequired(false);
      }
   }
}
