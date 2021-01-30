using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IBasicTransactionService
   {
      ITransaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      bool Delete(long transactionId);
      ITransaction Find(long transactionId);
      IEnumerable<ITransaction> Between(DateTime start, DateTime end);
   }
}