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
   public class Income : UserFilteredEntity, IIncome
   {
      public DateTime Date { get; set; }

      [Required]
      [MaxLength(Constants.MaxNameLength)]
      public string Name { get; set; }

      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      [Required]
      [MaxLength(Constants.MaxNotesLength)]
      public string Notes { get; set; }

      public long? ParentId { get; set; } = null;

      [NotMapped]
      public IRecurringIncome Parent
      {
         get => ParentProxy;
         set => ParentProxy = value as RecurringIncome;
      }

      [ForeignKey(nameof(ParentId))]
      public virtual RecurringIncome ParentProxy { get; set; } = null;

      [NotMapped]
      public IQueryable<ITransaction> Transactions => TransactionsProxy.Select(tb => tb.Transaction).Cast<ITransaction>().AsQueryable();
      public virtual ICollection<TransactionIncome> TransactionsProxy { get; set; } = new List<TransactionIncome>();

      public void DeleteAllTransactions(IRelationRepository relationRepository)
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
         model.Entity<Income>().HasOne(t => t.ParentProxy).WithMany().IsRequired(false);
      }
   }
}
