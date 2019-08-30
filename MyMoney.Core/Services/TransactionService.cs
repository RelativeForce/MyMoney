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
        private readonly ICurrentUserProvider _currentUserProvider;

        public TransactionService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _currentUserProvider = currentUserProvider;
        }

        public ITransaction Add(DateTime date, string description, decimal amount)
        {
            if (string.IsNullOrWhiteSpace(description))
                return null;

            var user = _currentUserProvider.CurrentUser;

            var transaction = _entityFactory.NewTransaction;
            transaction.Date = date;
            transaction.Description = description;
            transaction.Amount = amount;
            transaction.UserId = user.Id;
            transaction.User = user;

            return _repository.Add(transaction);
        }

        public bool Update(long transactionId, DateTime date, string description, decimal amount)
        {
            if (string.IsNullOrWhiteSpace(description))
                return false;

            var transaction = _repository.FindById<ITransaction>(transactionId);
            var userId = _currentUserProvider.CurrentUserId;

            if (transaction == null || transaction.UserId != userId)
                return false;

            transaction.Amount = amount;
            transaction.Date = date;
            transaction.Description = description;

            return _repository.Update(transaction);
        }

        public bool Delete(long transactionId)
        {
            var transaction = _repository.FindById<ITransaction>(transactionId);
            var userId = _currentUserProvider.CurrentUserId;

            if (transaction == null || transaction.UserId != userId)
                return false;

            return _repository.Delete(transaction);
        }
    }
}
