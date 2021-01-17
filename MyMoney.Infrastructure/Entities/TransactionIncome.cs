using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Entities.Abstract;
using System.ComponentModel.DataAnnotations;

namespace MyMoney.Infrastructure.Entities
{
   public class TransactionIncome : IRelationEntity
   {
      [Required]
      public long TransactionId { get; set; }
      public virtual Transaction Transaction { get; set; }

      [Required]
      public long IncomeId { get; set; }
      public virtual Income Income { get; set; }

      public TransactionIncome()
      {
         // Required by EF
      }

      public TransactionIncome(ITransaction transaction, IIncome income)
      {
         Transaction = transaction as Transaction;
         TransactionId = transaction.Id;
         Income = income as Income;
         IncomeId = income.Id;
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<TransactionIncome>().HasKey(t => new { t.IncomeId, t.TransactionId });
         model.Entity<TransactionIncome>().HasOne(t => t.Transaction).WithMany(t => t.IncomesProxy).OnDelete(DeleteBehavior.Cascade);
         model.Entity<TransactionIncome>().HasOne(t => t.Income).WithMany(t => t.TransactionsProxy).OnDelete(DeleteBehavior.Restrict);
      }
   }
}
