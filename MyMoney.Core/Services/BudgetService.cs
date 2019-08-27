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

        public IBudget Add(IUser user, DateTime month, decimal amount)
        {
            var filteredMonth = FilterDate(month);

            var existing = Find(user, filteredMonth);

            if (existing != null)
            {
                return existing;
            }

            var budget = _entityFactory.NewBudget;
            budget.Amount = amount;
            budget.Month = filteredMonth;

            return _repository.Add(budget);
        }

        public IBudget Find(IUser user, DateTime month)
        {
            var filteredMonth = FilterDate(month);

            return _repository.Find<IBudget>(b => b.Month.Equals(filteredMonth) && b.UserId == user.Id);
        }

        private static DateTime FilterDate(DateTime date)
        {
            var filteredDate = new DateTime(date.Year, date.Month, 1);

            return filteredDate;
        }
    }
}
