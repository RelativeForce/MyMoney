using System;
using System.Collections.Generic;
using MyMoney.Core.Data;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces.Services
{
   public interface IRecurringIncomeService
   {
      RecurringIncome Add(DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period);
      IEnumerable<Income> Between(DateTime start, DateTime end);
      bool Delete(long incomeId);
      RecurringIncome Find(long recurringIncomeId);
      IEnumerable<Income> From(DateTime date, int count);
      Income Realise(long recurringIncomeId, DateTime date);
      bool Update(long incomeId, DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period);
   }
}