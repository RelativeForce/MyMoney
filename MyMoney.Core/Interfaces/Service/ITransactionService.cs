using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface ITransactionService
   {
      ITransaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds);
      bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds);
      bool Delete(long transactionId);
      ITransaction Find(long transactionId);
      IList<ITransaction> Between(DateTime start, DateTime end);
   }
}
