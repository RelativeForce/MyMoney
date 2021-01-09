using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMoney.Infrastructure.Entities
{
   public class RecurringTransaction : RecurringEntity<Transaction>, IRecurringTransaction<Transaction>
   {
      [Required]
      public string Description { get; set; }
      [Required]
      public string Notes { get; set; }
      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      public override IList<Transaction> BuildVirtualInstances()
      {
         var duration = End.Subtract(Start);

         decimal amountPerTransaction = Amount / Recurrence.CountBetween(Start, End);

         var transactions = Recurrence.Repeat(Start, End, (DateTime date) => new Transaction
         {
            Date = date,
            Amount = amountPerTransaction,
            Description = Description,
            Notes = Notes,
            UserId = UserId,
            User = User,
            Id = 0,
            RecurringTransactionId = Id
         });

         return transactions;
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<RecurringTransaction>().HasIndex(t => new { t.UserId, t.Start, t.End, t.Recurrence, t.Description }).IsUnique();
         model.Entity<RecurringTransaction>().HasOne(t => t.UserProxy).WithMany().IsRequired();
      }
   }
}
