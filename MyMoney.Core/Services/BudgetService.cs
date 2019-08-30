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

        public BudgetService(IRepository repository, IEntityFactory entityFactory)
        {
            _repository = repository;
            _entityFactory = entityFactory;
        }

        public IBudget Add(IUser user, DateTime start, DateTime end, decimal amount, string notes)
        {
            notes = notes ?? "";
            start = CleanDate(start).Date;
            end = CleanDate(end).Date.AddDays(1).AddTicks(-1);

            var existingStart = Find(user, start);
            var existingEnd = Find(user, end);

            if (existingStart != null || existingEnd != null)
            {
                return null;
            }

            var budget = _entityFactory.NewBudget;
            budget.Amount = amount;
            budget.Start = start;
            budget.End = end;
            budget.Notes = notes;

            return _repository.Add(budget);
        }

        public IBudget Find(IUser user, DateTime date)
        {
            date = CleanDate(date);

            return _repository.Find<IBudget>(b => date >= b.Start && date <= b.End && b.UserId == user.Id);
        }

        private static DateTime CleanDate(DateTime date)
        {
            return date.ToUniversalTime();
        }
    }
}
