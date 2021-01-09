using System;
using System.Collections.Generic;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface ITransactionService
   {
      ITransaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      IRecurringTransaction AddRecurring(DateTime start, DateTime end, string description, decimal amount, string notes, Period period);
      bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      bool Delete(long transactionId);
      ITransaction Find(long transactionId);
      IList<ITransaction> Between(DateTime start, DateTime end);
   }
}