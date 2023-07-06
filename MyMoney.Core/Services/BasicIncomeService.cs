using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
   public sealed class BasicIncomeService : IBasicIncomeService
   {
      private readonly IRepository _repository;
      private readonly IEntityFactory _entityFactory;
      private readonly ICurrentUserProvider _currentUserProvider;

      public BasicIncomeService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
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

      public IIncome Add(DateTime date, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         var user = _currentUserProvider.CurrentUser;

         var income = _entityFactory.NewIncome;
         income.UserId = user.Id;
         income.User = user;
         income.Amount = amount;
         income.Date = date;
         income.Name = name;
         income.Notes = notes;

         return _repository.Add(income);
      }

      public IEnumerable<IIncome> From(DateTime start, int count)
      {
         if (count <= 0)
            return new List<IIncome>();

         var user = _currentUserProvider.CurrentUser;

         return _repository
            .UserFiltered<IIncome>(user)
            .Where(i => i.ParentId == null)
            .Where(i => i.Date <= start)
            .OrderByDescending(i => i.Date)
            .Take(count)
            .AsEnumerable();
      }

      public IEnumerable<IIncome> Between(DateTime start, DateTime end)
      {
         var user = _currentUserProvider.CurrentUser;

         return _repository
            .UserFiltered<IIncome>(user)
            .Where(i => i.ParentId == null)
            .Where(i => i.Date >= start && i.Date <= end)
            .AsEnumerable();
      }

      public bool Update(long incomeId, DateTime date, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return false;

         notes ??= string.Empty;

         var income = _repository.FindById<IIncome>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return false;

         var basicDataHasChanged =
            income.Amount != amount ||
            income.Date != date ||
            income.Name != name;

         // Cannot edit the basic data of a recuring income child
         if (income.ParentId != null && basicDataHasChanged)
            return false;

         income.Amount = amount;
         income.Date = date;
         income.Name = name;
         income.Notes = notes;

         return _repository.Update(income);
      }

      public bool Delete(long incomeId)
      {
         var income = _repository.FindById<IIncome>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return false;

         return _repository.Delete(income);
      }
   }
}
