using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Infrastructure.Entities.Abstract;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMoney.Infrastructure.Entities
{
   public class RecurringIncome : RecurringEntity<Income>
   {
      [Required]
      [MaxLength(Constants.MaxNameLength)]
      public string Name { get; set; }

      [Required]
      [MaxLength(Constants.MaxNotesLength)]
      public string Notes { get; set; }

      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      protected override Income BuildVirtualChild(DateTime date)
      {
         return new Income
         {
            Date = date,
            Amount = Amount,
            Name = Name,
            Notes = Notes,
            UserId = UserId,
            User = User,
            Id = _virtualIncomeId--,
            Parent = this,
            ParentId = Id
         };
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<RecurringIncome>().HasIndex(t => new { t.UserId, t.Start, t.End, t.Recurrence, t.Name }).IsUnique();
         model.Entity<RecurringIncome>().HasOne(t => t.User).WithMany().IsRequired();
      }

      /// <summary>
      /// A virtual Id for incomes that only exist as part of a recurring income.
      /// </summary>
      private static long _virtualIncomeId = -1;
   }
}
