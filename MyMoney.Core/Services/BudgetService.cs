using System;
using System.Text.RegularExpressions;
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

        public IBudget Add(string monthId, string name, decimal amount, string notes)
        {
            var user = _currentUserProvider.CurrentUser;

            notes = notes ?? "";
            name = name ?? "Budget for " + monthId;

            if (!Regex.Match(monthId, "^[0-9]{6}$").Success)
            {
                return null;
            }

            var budget = _entityFactory.NewBudget;
            budget.UserId = user.Id;
            budget.User = user;
            budget.Amount = amount;
            budget.MonthId = monthId;
            budget.Notes = notes;
            budget.Name = name;

            return _repository.Add(budget);
        }

        public IBudget Find(string monthId)
        {
            var user = _currentUserProvider.CurrentUser;

            return _repository.Find<IBudget>(b => monthId == b.MonthId && b.UserId == user.Id);
        }
    }
}
