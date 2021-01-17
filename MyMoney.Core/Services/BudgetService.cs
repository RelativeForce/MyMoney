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
      private readonly IRelationRepository _relationRepository;

      public BudgetService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider, IRelationRepository relationRepository)
      {
         _repository = repository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
         _relationRepository = relationRepository;
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
         var user = _currentUserProvider.CurrentUser;

         notes = notes ?? "";
         name = name ?? $"Budget for {month}/{year}";

         if (month <= 0 || year <= 0 || month > 12)
         {
            return null;
         }

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
         if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(notes))
            return false;

         var budget = _repository.FindById<IBudget>(budgetId);
         var userId = _currentUserProvider.CurrentUserId;

         if (budget == null || budget.UserId != userId || month <= 0 || year <= 0 || month > 12)
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

         budget.DeleteRelations(_relationRepository);

         return _repository.Delete(budget);
      }
   }
}
