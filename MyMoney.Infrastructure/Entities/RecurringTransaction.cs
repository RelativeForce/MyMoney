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
      public long UserId { get; set; }

      [NotMapped]
      public IUser User
      {
         get => UserProxy;
         set => UserProxy = value as User;
      }

      [ForeignKey(nameof(UserId))]
      public virtual User UserProxy { get; set; }

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
   }
}
