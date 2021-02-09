using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using System;
using System.Collections.Generic;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IRecurringTransactionService
   {
      IRecurringTransaction Add(DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period);
      IEnumerable<ITransaction> Between(DateTime start, DateTime end);
      bool Delete(long recurringTransactionId);
      IRecurringTransaction Find(long recurringTransactionId);
      IList<ITransaction> GetChildTransactions(IRecurringTransaction recurringTransaction);
      ITransaction Realise(long recurringTransactionId, DateTime date);
      bool Update(long recurringTransactionId, DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period);
   }
}