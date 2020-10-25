using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
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

      public IBudget Add(string monthId, string name, decimal amount, string notes)
      {
         var user = _currentUserProvider.CurrentUser;

         notes = notes ?? "";
         name = name ?? "Budget for " + monthId;

         if (!Regex.Match(monthId, "^[0-9]{6}$").Success)
         {
            return null;
         }

         var budget = _entityFactory.NewBudget;
         budget.UserId = user.Id;
         budget.User = user;
         budget.Amount = amount;
         budget.MonthId = monthId;
         budget.Notes = notes;
         budget.Name = name;

         return _repository.Add(budget);
      }

      public List<IBudget> List(string monthId)
      {
         var user = _currentUserProvider.CurrentUser;

         return user.Budgets.Where(b => monthId == b.MonthId).ToList();
      }

      public bool Update(long budgetId, string monthId, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(notes))
            return false;

         var budget = _repository.FindById<IBudget>(budgetId);
         var userId = _currentUserProvider.CurrentUserId;

         if (budget == null || budget.UserId != userId)
            return false;

         budget.Amount = amount;
         budget.Notes = notes;
         budget.Name = name;
         budget.MonthId = monthId;

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
