using System;
using System.Collections.Generic;
using MyMoney.Core.Data;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces.Services
{
   public interface IRecurringTransactionService
   {
      RecurringTransaction Add(DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period);
      IEnumerable<Transaction> Between(DateTime start, DateTime end);
      bool Delete(long recurringTransactionId);
      RecurringTransaction Find(long recurringTransactionId);
      Transaction Realise(long recurringTransactionId, DateTime date);
      bool Update(long recurringTransactionId, DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period);
   }
}