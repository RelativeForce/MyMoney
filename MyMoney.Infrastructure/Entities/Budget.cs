using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities
{
   public class Budget : BaseEntity, IBudget
   {
      public decimal Amount { get; set; }
      public string Notes { get; set; }
      public long UserId { get; set; }
      public int Year { get; set; }
      public int Month { get; set; }
      public string Name { get; set; }

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

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Budget>().HasOne(t => t.UserProxy).WithMany(t => t.BudgetsProxy).IsRequired();
      }
   }
}
