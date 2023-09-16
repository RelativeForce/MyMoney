using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Application.Interfaces;
using MyMoney.Application.Interfaces.Services;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Services
{
   public sealed class RecurringIncomeService : IRecurringIncomeService
   {
      private readonly IRepository _repository;
      private readonly ICurrentUserProvider _currentUserProvider;

      public RecurringIncomeService(IRepository repository, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _currentUserProvider = currentUserProvider;
      }

      public IEnumerable<Income> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<RecurringIncome>(userId)
            .Where(ri =>
               (ri.Start >= start && ri.Start <= end) || // Starts in the range
               (ri.End >= start && ri.End <= end) || // Ends in the range
               (ri.Start <= start && ri.End >= end)) // Spans the range
            .Include(ri => ri.RealChildren)
            .AsSplitQuery()
            .AsEnumerable()
            .Select(ri => ri.Children(i => i.Date >= start && i.Date <= end))
            .SelectMany(vi => vi);

         return recurring;
      }

      public IEnumerable<Income> From(DateTime date, int count)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<RecurringIncome>(userId)
            .Where(ri => ri.Start <= date)
            .Include(ri => ri.RealChildren)
            .AsSplitQuery()
            .AsEnumerable()
            .Select(ri => ri.Children(i => i.Date <= date))
            .SelectMany(vi => vi)
            .OrderByDescending(i => i.Date)
            .Take(count);

         return recurring;
      }

      public RecurringIncome Add(DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         if (start > end)
         {
            (start, end) = (end, start);
         }

         var user = _currentUserProvider.CurrentUser;

         var income = new RecurringIncome
         {
            Start = start,
            End = end,
            Recurrence = period,
            Name = name,
            Amount = amount,
            UserId = user.Id,
            User = user,
            Notes = notes
         };

         return _repository.Add(income);
      }

      public Income Realise(long recurringIncomeId, DateTime date)
      {
         var recurring = Find(recurringIncomeId);
         if (recurring == null)
            return null;

         var user = _currentUserProvider.CurrentUser;

         var income = new Income
         {
            Date = date,
            Name = recurring.Name,
            Amount = recurring.Amount,
            UserId = user.Id,
            User = user,
            Notes = string.Empty,
            Parent = recurring,
            ParentId = recurring.Id
         };

         return _repository.Add(income);
      }

      public RecurringIncome Find(long recurringIncomeId)
      {
         var userId = _currentUserProvider.CurrentUserId;
         
         return _repository
            .UserFiltered<RecurringIncome>(userId)
            .Include(ri => ri.RealChildren)
            .AsSplitQuery()
            .FirstOrDefault(ri => ri.Id == recurringIncomeId);
      }

      public bool Update(long incomeId, DateTime start, DateTime end, string name, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return false;

         notes ??= string.Empty;

         if (start > end)
         {
            (start, end) = (end, start);
         }

         var income = Find(incomeId);

         if (income == null)
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

         var children = income.RealChildren;

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
         var income = Find(incomeId);

         if (income == null)
            return false;

         if (!_repository.DeleteRange(income.RealChildren))
            return false;

         return _repository.Delete(income);
      }
   }
}
