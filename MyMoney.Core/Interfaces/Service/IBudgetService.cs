using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IBudgetService
   {
      IBudget Add(int month, int year, string name, decimal amount, string notes);
      bool Delete(long budgetId);
      IBudget Find(long budgetId);
      List<IBudget> List(int month, int year);
      bool Update(long budgetId, int month, int year, string name, decimal amount, string notes);
   }
}
