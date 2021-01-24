﻿using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMoney.Infrastructure.Entities
{
   public class RecurringTransaction : RecurringEntity<ITransaction>, IRecurringTransaction
   {
      [Required]
      [MaxLength(Constants.MaxNameLength)]
      public string Description { get; set; }

      [Required]
      [MaxLength(Constants.MaxNotesLength)]
      public string Notes { get; set; }

      [Column(TypeName = "decimal(18,2)")]
      public decimal Amount { get; set; }

      protected override ITransaction BuildVirtualChild(DateTime date)
      {
         return new Transaction
         {
            Date = date,
            Amount = Amount,
            Description = Description,
            Notes = Notes,
            UserId = UserId,
            User = User,
            Id = VirtualTransactionId--,
            Parent = this,
            ParentId = Id
         };
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
