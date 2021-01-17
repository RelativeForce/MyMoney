using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Entities.Abstract;
using System.ComponentModel.DataAnnotations;

namespace MyMoney.Infrastructure.Entities
{
   public class TransactionBudget : IRelationEntity
   {
      [Required]
      public long TransactionId { get; set; }
      public virtual Transaction Transaction { get; set; }

      [Required]
      public long BudgetId { get; set; }
      public virtual Budget Budget { get; set; }

      public TransactionBudget()
      {
         // Required by EF
      }

      public TransactionBudget(ITransaction transaction, IBudget budget)
      {
         Transaction = transaction as Transaction;
         TransactionId = transaction.Id;
         Budget = budget as Budget;
         BudgetId = budget.Id;
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<TransactionBudget>().HasKey(t => new { t.BudgetId, t.TransactionId });
         model.Entity<TransactionBudget>().HasOne(t => t.Transaction).WithMany(t => t.BudgetsProxy).OnDelete(DeleteBehavior.Cascade);
         model.Entity<TransactionBudget>().HasOne(t => t.Budget).WithMany(t => t.TransactionsProxy).OnDelete(DeleteBehavior.Restrict);
      }
   }
}
