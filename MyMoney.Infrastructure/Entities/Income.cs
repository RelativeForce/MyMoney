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
   public class Income : UserFilteredEntity, IIncome
   {
      public DateTime Date { get; set; }
      [Required]
      public string Name { get; set; }
      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      [NotMapped]
      public IQueryable<ITransaction> Transactions => TransactionsProxy.Select(tb => tb.Transaction).Cast<ITransaction>().AsQueryable();
      public virtual ICollection<TransactionIncome> TransactionsProxy { get; set; } = new List<TransactionIncome>();
      
      public void AddTransaction(IRelationRepository relationRepository, ITransaction transaction)
      {
         if (transaction is Transaction t)
         {
            relationRepository.Add(new TransactionIncome(t, this));
         }
      }

      public void RemoveTransaction(IRelationRepository relationRepository, ITransaction transaction)
      {
         var transactionIncome = TransactionsProxy.FirstOrDefault(t => t.TransactionId == transaction.Id);

         if (transactionIncome != null)
         {
            relationRepository.Delete(transactionIncome);
         }
      }

      public void RemoveAllTransactions(IRelationRepository relationRepository)
      {
         foreach (var transaction in TransactionsProxy.ToList())
         {
            relationRepository.Delete(transaction);
         }
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Income>().HasIndex(t => new { t.UserId, t.Date, t.Name }).IsUnique();
         model.Entity<Income>().HasOne(t => t.UserProxy).WithMany().IsRequired();
      }
   }
}
