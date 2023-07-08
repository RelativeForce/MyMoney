using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
   public sealed class BudgetService : IBudgetService
   {
      private readonly IRepository _repository;
      private readonly IEntityFactory _entityFactory;
      private readonly ICurrentUserProvider _currentUserProvider;

      public BudgetService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
      }

      public IBudget Find(long budgetId)
      {
         var budget = _repository.FindById<IBudget>(budgetId);
         var userId = _currentUserProvider.CurrentUserId;

         if (budget == null || budget.UserId != userId)
            return null;

         return budget;
      }

      public IBudget Add(int month, int year, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || month <= 0 || year <= 0 || month > 12 || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         var user = _currentUserProvider.CurrentUser;

         var budget = _entityFactory.NewBudget;
         budget.UserId = user.Id;
         budget.User = user;
         budget.Amount = amount;
         budget.Month = month;
         budget.Year = year;
         budget.Notes = notes;
         budget.Name = name;

         return _repository.Add(budget);
      }

      public List<IBudget> List(int month, int year)
      {
         var user = _currentUserProvider.CurrentUser;

         return _repository
            .UserFiltered<IBudget>(user)
            .Where(b => month == b.Month && year == b.Year)
            .OrderBy(b => b.Name)
            .ToList();
      }

      public bool Update(long budgetId, int month, int year, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || month <= 0 || year <= 0 || month > 12 || amount < 0.01m)
            return false;

         notes ??= string.Empty;

         var budget = _repository.FindById<IBudget>(budgetId);
         var userId = _currentUserProvider.CurrentUserId;

         if (budget == null || budget.UserId != userId)
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
         var budget = _repository.FindById<IBudget>(budgetId);
         var userId = _currentUserProvider.CurrentUserId;

         if (budget == null || budget.UserId != userId)
            return false;

         return _repository.Delete(budget);
      }
   }
}
