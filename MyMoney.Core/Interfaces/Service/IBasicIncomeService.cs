using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IBasicIncomeService
   {
      IIncome Add(DateTime date, string name, decimal amount, string notes);
      bool Update(long incomeId, DateTime date, string name, decimal amount, string notes);
      bool Delete(long incomeId);
      IIncome Find(long incomeId);
      IEnumerable<IIncome> From(DateTime start, int count);
      IEnumerable<IIncome> Between(DateTime start, DateTime end);
   }
}
