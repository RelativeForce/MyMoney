using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
   public sealed class IncomeService : IIncomeService
   {
      private readonly IRepository _repository;
      private readonly IEntityFactory _entityFactory;
      private readonly ICurrentUserProvider _currentUserProvider;

      public IncomeService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
      }

      public IIncome Find(long incomeId)
      {
         var income = _repository.FindById<IIncome>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return null;

         return income;
      }

      public IIncome Add(DateTime date, string name, decimal amount)
      {
         var user = _currentUserProvider.CurrentUser;

         if (string.IsNullOrWhiteSpace(name) || amount <= 0)
            return null;

         var income = _entityFactory.NewIncome;
         income.UserId = user.Id;
         income.User = user;
         income.Amount = amount;
         income.Date = date;
         income.Name = name;

         return _repository.Add(income);
      }

      public IList<IIncome> From(DateTime start, int count)
      {
         if (count <= 0)
            return new List<IIncome>();

         var user = _currentUserProvider.CurrentUser;

         return user.Incomes.Where(b => b.Date <= start).Take(count).ToList();
      }

      public bool Update(long incomeId, DateTime date, string name, decimal amount)
      {
         if (string.IsNullOrWhiteSpace(name) || amount <= 0)
            return false;

         var income = _repository.FindById<IIncome>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return false;

         income.Amount = amount;
         income.Date = date;
         income.Name = name;

         return _repository.Update(income);
      }

      public bool Delete(long incomeId)
      {
         var income = _repository.FindById<IBudget>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return false;

         return _repository.Delete(income);
      }
   }
}
