using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities
{
   public class Income : UserFilteredEntity, IRecurringChildEntity
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

      [ForeignKey(nameof(ParentId))]
      public virtual RecurringIncome Parent { get; set; } = null;

      [NotMapped]
      public IQueryable<Transaction> Transactions => TransactionsProxy.Select(tb => tb.Transaction).AsQueryable();
      public virtual ICollection<TransactionIncome> TransactionsProxy { get; set; } = new List<TransactionIncome>();

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Income>().HasIndex(t => new { t.UserId, t.Date, t.Name }).IsUnique();
         model.Entity<Income>().HasOne(t => t.User).WithMany().IsRequired();
         model.Entity<Income>().HasOne(t => t.Parent).WithMany(ri => ri.RealChildren).IsRequired(false);
      }
   }
}
