using System;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
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

        public ITransaction Add(IUser user, DateTime date, string description, decimal amount)
        {
            if (string.IsNullOrWhiteSpace(description) || user == null)
                return null;

            var transaction = _entityFactory.NewTransaction;
            transaction.Date = date;
            transaction.Description = description;
            transaction.Amount = amount;
            transaction.UserId = user.Id;
            transaction.User = user;

            return _repository.Add(transaction);
        }

        public bool Update(IUser user, ITransaction transaction)
        {
            if (string.IsNullOrWhiteSpace(transaction.Description) || transaction.UserId != user.Id || transaction.User == null || transaction.UserId == default)
                return false;

            return _repository.Update(transaction);
        }

        public bool Delete(IUser user, long transactionId)
        {
            var transaction = _repository.FindById<ITransaction>(transactionId);

            if (transaction == null || transaction.UserId != user.Id)
                return false;

            return _repository.Delete(transaction);
        }

        public ITransaction FindById(long transactionId)
        {
            return _repository.FindById<ITransaction>(transactionId);
        }
    }
}
