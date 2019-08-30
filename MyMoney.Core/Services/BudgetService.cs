using System;
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

        public IBudget Add(DateTime start, DateTime end, decimal amount, string notes)
        {
            var user = _currentUserProvider.CurrentUser;

            notes = notes ?? "";

            if(end < start)
            {
                var temp = start;
                start = end;
                end = temp;
            }

            start = CleanDate(start).Date;
            end = CleanDate(end).Date.AddDays(1).AddTicks(-1);

            var existingStart = Find(start);
            var existingEnd = Find(end);

            if (existingStart != null || existingEnd != null)
            {
                return null;
            }

            var budget = _entityFactory.NewBudget;
            budget.UserId = user.Id;
            budget.User = user;
            budget.Amount = amount;
            budget.Start = start;
            budget.End = end;
            budget.Notes = notes;

            return _repository.Add(budget);
        }

        public IBudget Find(DateTime date)
        {
            var user = _currentUserProvider.CurrentUser;

            date = CleanDate(date);

            return _repository.Find<IBudget>(b => date >= b.Start && date <= b.End && b.UserId == user.Id);
        }

        private static DateTime CleanDate(DateTime date)
        {
            return date.ToUniversalTime();
        }
    }
}
