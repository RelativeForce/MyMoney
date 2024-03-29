﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities
{
   public class TransactionIncome : IRelationEntity
   {
      [Required]
      public long TransactionId { get; set; }
      public virtual Transaction Transaction { get; set; }

      [Required]
      public long IncomeId { get; set; }
      public virtual Income Income { get; set; }

      public TransactionIncome()
      {
         // Required by EF
      }

      public TransactionIncome(Transaction transaction, Income income)
      {
         Transaction = transaction;
         TransactionId = transaction.Id;
         Income = income;
         IncomeId = income.Id;
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<TransactionIncome>().HasKey(t => new { t.IncomeId, t.TransactionId });
         model.Entity<TransactionIncome>().HasOne(t => t.Transaction).WithMany(t => t.IncomesProxy).OnDelete(DeleteBehavior.Cascade);
         model.Entity<TransactionIncome>().HasOne(t => t.Income).WithMany(t => t.TransactionsProxy).OnDelete(DeleteBehavior.Restrict);
      }
   }
}
