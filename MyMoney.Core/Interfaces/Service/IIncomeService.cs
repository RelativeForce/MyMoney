using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IIncomeService
   {
      IIncome Add(DateTime date, string name, decimal amount);
      bool Update(long incomeId, DateTime date, string name, decimal amount);
      bool Delete(long incomeId);
      IIncome Find(long incomeId);
      IList<IIncome> From(DateTime start, int count);
   }
}
