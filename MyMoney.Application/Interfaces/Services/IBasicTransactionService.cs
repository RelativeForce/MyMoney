using System;
using System.Collections.Generic;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces.Services
{
   public interface IBasicTransactionService
   {
      Transaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds);
      bool Delete(long transactionId);
      Transaction Find(long transactionId);
      IEnumerable<Transaction> Between(DateTime start, DateTime end);
   }
}