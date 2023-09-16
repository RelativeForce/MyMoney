using System;
using System.Collections.Generic;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces.Services
{
   public interface IBasicIncomeService
   {
      Income Add(DateTime date, string name, decimal amount, string notes);
      bool Update(long incomeId, DateTime date, string name, decimal amount, string notes);
      bool Delete(long incomeId);
      Income Find(long incomeId);
      IEnumerable<Income> From(DateTime start, int count);
      IEnumerable<Income> Between(DateTime start, DateTime end);
   }
}
