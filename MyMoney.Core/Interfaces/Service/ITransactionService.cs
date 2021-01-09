using System;
using System.Collections.Generic;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface ITransactionService
   {
      ITransaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      IRecurringTransaction AddRecurring(DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period);
      bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      bool UpdateRecurring(long transactionId, DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period);
      bool Delete(long transactionId);
      bool DeleteRecurring(long transactionId);
      ITransaction Find(long transactionId);
      IRecurringTransaction FindRecurring(long transactionId);
      IList<ITransaction> Between(DateTime start, DateTime end);
   }
}