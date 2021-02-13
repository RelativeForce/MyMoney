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
            .Where(ri =>
               (ri.Start >= start && ri.Start <= end) || // Starts in the range
               (ri.End >= start && ri.End <= end) || // Ends in the range
               (ri.Start <= start && ri.End >= end)) // Spans the range
            .AsEnumerable()
            .Select(ri => ri.Children(_repository, i => i.Date >= start && i.Date <= end))
            .SelectMany(vi => vi);

         return recurring;
      }

      public IEnumerable<IIncome> From(DateTime date, int count)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<IRecurringIncome>(userId)
            .Where(ri => ri.Start <= date)
            .AsEnumerable()
            .Select(ri => ri.Children(_repository, i => i.Date <= date))
            .SelectMany(vi => vi)
            .OrderByDescending(i => i.Date)
            .Take(count);

         return recurring;
      }

      public IRecurringIncome Add(DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

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

         notes ??= string.Empty;

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
            .Where(i => i.ParentId == incomeId)
            .ToList();

         if (clearChildren)
            return _repository.DeleteRange(children);

         if (trimBounds)
         {
            var invalidChildren = children.Where(i => i.Date > end);

            if (!_repository.DeleteRange(invalidChildren))
               return false;
            
            children = children.Where(i => i.Date <= end).ToList();
         }
         
         foreach (var child in children)
         {
            child.Name = name;
            child.Amount = amount;
         }

         return _repository.UpdateRange(children);
      }

      public bool Delete(long incomeId)
      {
         var income = _repository.FindById<IRecurringIncome>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return false;

         var children = _repository
            .UserFiltered<IIncome>(userId)
            .Where(i => i.ParentId == incomeId)
            .ToList();

         if (!_repository.DeleteRange(children))
            return false;

         return _repository.Delete(income);
      }
   }
}
