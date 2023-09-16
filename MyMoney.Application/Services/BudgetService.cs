using System.Collections.Generic;
using System.Linq;
using MyMoney.Application.Interfaces;
using MyMoney.Application.Interfaces.Services;
using MyMoney.Core.Interfaces;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Services
{
   public sealed class BudgetService : IBudgetService
   {
      private readonly IRepository _repository;
      private readonly ICurrentUserProvider _currentUserProvider;

      public BudgetService(IRepository repository, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _currentUserProvider = currentUserProvider;
      }

      public Budget Find(long budgetId)
      {
         var userId = _currentUserProvider.CurrentUserId;
         
         return _repository.UserFiltered<Budget>(userId).FirstOrDefault(b => b.Id == budgetId);
      }

      public Budget Add(int month, int year, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || month <= 0 || year <= 0 || month > 12 || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         var user = _currentUserProvider.CurrentUser;

         var budget = new Budget
         {
            UserId = user.Id,
            User = user,
            Amount = amount,
            Month = month,
            Year = year,
            Notes = notes,
            Name = name
         };

         return _repository.Add(budget);
      }

      public List<Budget> List(int month, int year)
      {
         var userId = _currentUserProvider.CurrentUserId;

         return _repository
            .UserFiltered<Budget>(userId)
            .Where(b => month == b.Month && year == b.Year)
            .OrderBy(b => b.Name)
            .ToList();
      }

      public bool Update(long budgetId, int month, int year, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || month <= 0 || year <= 0 || month > 12 || amount < 0.01m)
            return false;

         notes ??= string.Empty;
         
         var budget = Find(budgetId);

         if (budget == null)
            return false;

         budget.Month = month;
         budget.Year = year;
         budget.Amount = amount;
         budget.Notes = notes;
         budget.Name = name;

         return _repository.Update(budget);
      }

      public bool Delete(long budgetId)
      {
         var budget = Find(budgetId);

         if (budget == null)
            return false;

         return _repository.Delete(budget);
      }
   }
}
