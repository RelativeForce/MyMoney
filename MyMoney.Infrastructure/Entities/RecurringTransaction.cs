using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace MyMoney.Infrastructure.Entities
{
   public class RecurringTransaction : RecurringEntity<ITransaction>, IRecurringTransaction
   {
      [Required]
      public string Description { get; set; }
      [Required]
      public string Notes { get; set; }
      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      public override IList<ITransaction> ToInstances()
      {
         var duration = End.Subtract(Start);

         var transactions = Recurrence.Repeat(Start, End, (DateTime date) => new Transaction
         {
            Date = date,
            Amount = Amount,
            Description = Description,
            Notes = Notes,
            UserId = UserId,
            User = User,
            Id = VirtualTransactionId--,
            Parent = this,
         });

         return transactions.Cast<ITransaction>().ToList();
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<RecurringTransaction>().HasIndex(t => new { t.UserId, t.Start, t.End, t.Recurrence, t.Description }).IsUnique();
         model.Entity<RecurringTransaction>().HasOne(t => t.UserProxy).WithMany().IsRequired();
      }

      /// <summary>
      /// A virtual Id for transactions that only exist as part of a recuring transaction.
      /// </summary>
      private static long VirtualTransactionId = -1;
   }
}
