using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
   public sealed class RecurringIncomeService : IRecurringIncomeService
   {
      private readonly IRepository _repository;
      private readonly IEntityFactory _entityFactory;
      private readonly ICurrentUserProvider _currentUserProvider;

      public RecurringIncomeService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
      }

      public IEnumerable<IIncome> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<IRecurringIncome>(userId)
            .Where(rt =>
               (rt.Start >= start && rt.Start <= end) || // Starts in the range
               (rt.End >= start && rt.End <= end) || // Ends in the range
               (rt.Start <= start && rt.End >= end)) // Spans the range
            .AsEnumerable()
            .Select(rt => rt.Children(_repository, t => t.Date >= start && t.Date <= end))
            .SelectMany(vt => vt);

         return recurring;
      }

      public IEnumerable<IIncome> From(DateTime date, int count)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<IRecurringIncome>(userId)
            .Where(rt => rt.Start <= date)
            .AsEnumerable()
            .Select(rt => rt.Children(_repository, t => t.Date <= date))
            .SelectMany(vt => vt)
            .OrderByDescending(t => t.Date)
            .Take(count);

         return recurring;
      }

      public IRecurringIncome Add(DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return null;

         if (notes == null)
            notes = "";

         if (start > end)
         {
            var temp = start;
            start = end;
            end = temp;
         }

         var user = _currentUserProvider.CurrentUser;

         var income = _entityFactory.NewRecurringIncome;
         income.Start = start;
         income.End = end;
         income.Recurrence = period;
         income.Name = name;
         income.Amount = amount;
         income.UserId = user.Id;
         income.User = user;
         income.Notes = notes;

         return _repository.Add(income);
      }

      public IIncome Realise(long recurringIncomeId, DateTime date)
      {
         var recurring = Find(recurringIncomeId);
         if (recurring == null)
            return null;

         var user = _currentUserProvider.CurrentUser;

         var income = _entityFactory.NewIncome;

         income.Date = date;
         income.Name = recurring.Name;
         income.Amount = recurring.Amount;
         income.UserId = user.Id;
         income.User = user;
         income.Notes = string.Empty;
         income.Parent = recurring;
         income.ParentId = recurring.Id;

         return _repository.Add(income);
      }

      public IRecurringIncome Find(long recurringIncomeId)
      {
         var income = _repository.FindById<IRecurringIncome>(recurringIncomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return null;

         return income;
      }

      public IList<IIncome> GetChildIncomes(IRecurringIncome recurringIncome)
      {
         return recurringIncome.Children(_repository);
      }

      public bool Update(long incomeId, DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return false;

         if (notes == null)
            notes = "";

         if (start > end)
         {
            var temp = start;
            start = end;
            end = temp;
         }

         var income = _repository.FindById<IRecurringIncome>(incomeId);
         var user = _currentUserProvider.CurrentUser;

         if (income == null || income.UserId != user.Id)
            return false;

         var clearChildren = income.Start != start || income.Recurrence != period;
         var trimBounds = income.End != end && !clearChildren;

         income.Start = start;
         income.End = end;
         income.Recurrence = period;
         income.Name = name;
         income.Amount = amount;
         income.Notes = notes;

         if (!_repository.Update(income))
            return false;

         var children = _repository
            .UserFiltered<IIncome>(user)
            .Where(t => t.ParentId == incomeId)
            .Where(t => !trimBounds || t.Date > end)
            .ToList();

         if (clearChildren || trimBounds)
         {
            // Clear the children that are invalid as a result of the change
            foreach (var child in children)
            {
               _repository.Delete(child);
            }

            return true;
         }

         foreach (var child in children)
         {
            child.Name = name;
            child.Amount = amount;

            _repository.Update(child);
         }

         return true;
      }

      public bool Delete(long incomeId)
      {
         var income = _repository.FindById<IRecurringIncome>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return false;

         var children = _repository
            .UserFiltered<IIncome>(userId)
            .Where(t => t.ParentId == incomeId)
            .ToList();

         foreach (var child in children)
         {
            if (!_repository.Delete(child))
               return false;
         }

         return _repository.Delete(income);
      }
   }
}
