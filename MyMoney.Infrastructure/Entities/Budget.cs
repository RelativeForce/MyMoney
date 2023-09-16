using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Infrastructure.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities
{
   public class Budget : UserFilteredEntity
   {
      public int Year { get; set; }

      public int Month { get; set; }

      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      [Required]
      [MaxLength(Constants.MaxNameLength)]
      public string Name { get; set; }

      [Required]
      [MaxLength(Constants.MaxNotesLength)]
      public string Notes { get; set; }

      [NotMapped]
      public IQueryable<Transaction> Transactions => TransactionsProxy.Select(tb => tb.Transaction).AsQueryable();

      public virtual ICollection<TransactionBudget> TransactionsProxy { get; set; } = new List<TransactionBudget>();

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<Budget>().HasIndex(t => new { t.UserId, t.Year, t.Month, t.Name }).IsUnique();
         model.Entity<Budget>().HasOne(t => t.User).WithMany().IsRequired();
      }
   }
}
