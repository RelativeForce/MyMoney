using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities
{
   public class Income : BaseEntity, IIncome
   {
      public DateTime Date { get; set; }
      public string Name { get; set; }
      public decimal Amount { get; set; }
      public long UserId { get; set; }

      [NotMapped]
      public IUser User
      {
         get => UserProxy;
         set => UserProxy = value as User;
      }

      [ForeignKey(nameof(UserId))]
      public virtual User UserProxy { get; set; }

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
         model.Entity<Income>().HasOne(t => t.UserProxy).WithMany(t => t.IncomesProxy).IsRequired();
      }
   }
}
