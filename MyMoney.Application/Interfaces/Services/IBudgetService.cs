using System.Collections.Generic;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces.Services
{
   public interface IBudgetService
   {
      Budget Add(int month, int year, string name, decimal amount, string notes);
      bool Delete(long budgetId);
      Budget Find(long budgetId);
      List<Budget> List(int month, int year);
      bool Update(long budgetId, int month, int year, string name, decimal amount, string notes);
   }
}
