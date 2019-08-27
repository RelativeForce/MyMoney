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

        public IBudget Add(DateTime month, decimal amount)
        {
            var filteredMonth = FilterDate(month);

            if (Find(filteredMonth) != null)
            {
                return null;
            }

            var budget = _entityFactory.NewBudget;
            budget.Amount = amount;
            budget.Month = filteredMonth;

            return _repository.Add(budget);
        }

        public IBudget Find(DateTime month)
        {
            var filteredMonth = FilterDate(month);

            return _repository.Find<IBudget>(b => b.Month.Equals(filteredMonth));
        }

        private static DateTime FilterDate(DateTime date)
        {
            var filteredDate = new DateTime(date.Year, date.Month, 1);

            return filteredDate;
        }
    }
}
