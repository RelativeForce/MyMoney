using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities
{
   public class Transaction : BaseEntity, ITransaction
   {
      public DateTime Date { get; set; }
      [Required]
      public string Description { get; set; }
      public string Notes { get; set; }
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
      public IQueryable<IBudget> Budgets => BudgetsProxy.Select(tb => tb.Budget).Cast<IBudget>().AsQueryable();
      public virtual ICollection<TransactionBudget> BudgetsProxy { get; set; } = new List<TransactionBudget>();

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Transaction>().HasIndex(t => new { t.UserId, t.Date, t.Description }).IsUnique();
         model.Entity<Transaction>().HasOne(t => t.UserProxy).WithMany(t => t.TransactionsProxy).IsRequired();
      }
   }
}
