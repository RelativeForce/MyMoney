using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities
{
   public class Transaction : BaseEntity, ITransaction
   {
      public DateTime Date { get; set; }
      [Required]
      public string Description { get; set; }
      [Required]
      public string Notes { get; set; }
      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }
      public long UserId { get; set; }

      [NotMapped]
      public long? RecurringTransactionId { get; set; } = null;

      [NotMapped]
      public IUser User
      {
         get => UserProxy;
         set => UserProxy = value as User;
      }

      [ForeignKey(nameof(UserId))]
      public virtual User UserProxy { get; set; }

      [NotMapped]
      public IQueryable<IBudget> Budgets => BudgetsProxy.Select(tb => tb.Budget).Cast<IBudget>().AsQueryable();
      public virtual ICollection<TransactionBudget> BudgetsProxy { get; set; } = new List<TransactionBudget>();

      [NotMapped]
      public IQueryable<IIncome> Incomes => IncomesProxy.Select(tb => tb.Income).Cast<IIncome>().AsQueryable();
      public virtual ICollection<TransactionIncome> IncomesProxy { get; set; } = new List<TransactionIncome>();

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Transaction>().HasIndex(t => new { t.UserId, t.Date, t.Description }).IsUnique();
         model.Entity<Transaction>().HasOne(t => t.UserProxy).WithMany(t => t.TransactionsProxy).IsRequired();
      }
   }
}
