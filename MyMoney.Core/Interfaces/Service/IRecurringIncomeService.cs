using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using System;
using System.Collections.Generic;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IRecurringIncomeService
   {
      IRecurringIncome Add(DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period);
      IEnumerable<IIncome> Between(DateTime start, DateTime end);
      bool Delete(long incomeId);
      IRecurringIncome Find(long recurringIncomeId);
      IEnumerable<IIncome> From(DateTime date, int count);
      IList<IIncome> GetChildIncomes(IRecurringIncome recurringIncome);
      IIncome Realise(long recurringIncomeId, DateTime date);
      bool Update(long incomeId, DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period);
   }
}