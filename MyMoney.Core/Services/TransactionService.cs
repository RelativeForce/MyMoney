using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entites;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
    public sealed class TransactionService : ITransactionService
    {
        private readonly IRepository _repository;
        private readonly IEntityFactory _entityFactory;

        public TransactionService(IRepository repository, IEntityFactory entityFactory)
        {
            _repository = repository;
            _entityFactory = entityFactory;
        }

        public IList<ITransaction> Between(DateTime start, DateTime end)
        {
            return _repository
                .Where<ITransaction>(t => DateTime.Compare(t.Date, start) >= 0 && DateTime.Compare(t.Date, end) <= 0)
                .ToList();
        }

        public ITransaction Add(DateTime date, string description, decimal amount)
        {
            var transaction = _entityFactory.NewTransaction;
            transaction.Date = date;
            transaction.Description = description;
            transaction.Amount = amount;

            return _repository.Add(transaction);
        }
    }
}
