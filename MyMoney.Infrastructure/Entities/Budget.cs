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
   public class Budget : UserFilteredEntity, IBudget
   {
      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }
      public string Notes { get; set; }
      public int Year { get; set; }
      public int Month { get; set; }
      [Required]
      public string Name { get; set; }

      [NotMapped]
      public IQueryable<ITransaction> Transactions => TransactionsProxy.Select(tb => tb.Transaction).Cast<ITransaction>().AsQueryable();
      public virtual ICollection<TransactionBudget> TransactionsProxy { get; set; } = new List<TransactionBudget>();

      public void AddTransaction(IRelationRepository relationRepository, ITransaction transaction)
      {
         if (transaction is Transaction t)
         {
            relationRepository.Add(new TransactionBudget(t, this));
         }
      }

      public void RemoveTransaction(IRelationRepository relationRepository, ITransaction transaction)
      {
         var transactionBudget = TransactionsProxy.FirstOrDefault(t => t.TransactionId == transaction.Id);

         if (transactionBudget != null)
         {
            relationRepository.Delete(transactionBudget);
         }
      }

      public void RemoveAllTransactions(IRelationRepository relationRepository)
      {
         foreach(var transaction in TransactionsProxy.ToList())
         {
            relationRepository.Delete(transaction);
         }
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Budget>().HasIndex(t => new { t.UserId, t.Year, t.Month, t.Name }).IsUnique();
         model.Entity<Budget>().HasOne(t => t.UserProxy).WithMany().IsRequired();
      }
   }
}
