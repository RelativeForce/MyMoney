using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Data;
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
      private readonly IRelationRepository _relationRepository;

      public IncomeService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider, IRelationRepository relationRepository)
      {
         _repository = repository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
         _relationRepository = relationRepository;
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

         return _repository
            .UserFiltered<IIncome>(user)
            .Where(i => i.Date <= start)
            .OrderByDescending(i => i.Date)
            .Take(count)
            .ToList();
      }

      public IList<IIncome> Between(DateTime start, DateTime end)
      {
         var user = _currentUserProvider.CurrentUser;

         return _repository
            .UserFiltered<IIncome>(user)
            .Where(i => i.Date >= start && i.Date <= end)
            .OrderByDescending(i => i.Date)
            .ToList();
      }

      public IList<RunningTotal> RunningTotal(decimal initialTotal, DateTime start, DateTime end)
      {
         var user = _currentUserProvider.CurrentUser;

         var transactions = _repository
            .UserFiltered<ITransaction>(user)
            .Where(t => t.Date >= start && t.Date <= end)
            .AsEnumerable()
            .Select(t => new RunningTotal(t));

         var recurringTransactions = _repository
            .UserFiltered<IRecurringTransaction>(user)
            .Where(rt =>
               (rt.Start >= start && rt.Start <= end) || // Starts in the range
               (rt.End >= start && rt.End <= end) || // Ends in the range
               (rt.Start <= start && rt.End >= end)) // Spans the range
            .AsEnumerable()
            .Select(rt => rt.VirtualChildren())
            .SelectMany(vt => vt)
            .Where(t => t.Date >= start && t.Date <= end)
            .Select(t => new RunningTotal(t));

         var incomes = _repository
            .UserFiltered<IIncome>(user)
            .Where(i => i.Date >= start && i.Date <= end)
            .AsEnumerable()
            .Select(i => new RunningTotal(i));

         var runningTotals = transactions
            .Concat(incomes)
            .Concat(recurringTransactions)
            .OrderBy(rt => rt.Date)
            .ToList();

         foreach (var rt in runningTotals)
         {
            initialTotal = rt.AdjustTotal(initialTotal);
         }

         return runningTotals;
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
         var income = _repository.FindById<IIncome>(incomeId);
         var userId = _currentUserProvider.CurrentUserId;

         if (income == null || income.UserId != userId)
            return false;

         income.RemoveAllTransactions(_relationRepository);

         return _repository.Delete(income);
      }
   }
}
