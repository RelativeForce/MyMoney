using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
   public sealed class BasicTransactionService : IBasicTransactionService
   {
      private readonly IRepository _repository;
      private readonly IRelationRepository _relationRepository;
      private readonly IEntityFactory _entityFactory;
      private readonly ICurrentUserProvider _currentUserProvider;

      public BasicTransactionService(IRepository repository, IRelationRepository relationRepository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _relationRepository = relationRepository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
      }

      public IEnumerable<ITransaction> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var basic = _repository
            .UserFiltered<ITransaction>(userId)
            .Where(t => t.ParentId == null)
            .Where(t => t.Date >= start && t.Date <= end)
            .AsEnumerable();

         return basic;
      }

      public ITransaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         var user = _currentUserProvider.CurrentUser;

         var transaction = _entityFactory.NewTransaction;
         transaction.Date = date;
         transaction.Description = description;
         transaction.Amount = amount;
         transaction.UserId = user.Id;
         transaction.User = user;
         transaction.Notes = notes;
         transaction.Parent = null;
         transaction.ParentId = null;

         var addedTransaction = _repository.Add(transaction);

         if (addedTransaction == null)
            return null;

         // Add relations
         transaction.UpdateBudgets(_repository, _relationRepository, budgetIds);
         transaction.UpdateIncomes(_repository, _relationRepository, incomeIds);

         return _repository.Update(addedTransaction) ? addedTransaction : null;
      }

      public ITransaction Find(long transactionId)
      {
         var transaction = _repository.FindById<ITransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return null;

         return transaction;
      }

      public bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return false;

         notes ??= string.Empty;

         var transaction = _repository.FindById<ITransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return false;

         var basicDataHasChanged = 
            transaction.Amount != amount ||
            transaction.Date != date ||
            transaction.Description != description;

         // Cannot edit the basic data of a recuring transaction child
         if (transaction.ParentId != null && basicDataHasChanged)
            return false;

         transaction.Amount = amount;
         transaction.Date = date;
         transaction.Description = description;
         transaction.Notes = notes;

         // Update relations
         transaction.UpdateBudgets(_repository, _relationRepository, budgetIds);
         transaction.UpdateIncomes(_repository, _relationRepository, incomeIds);

         return _repository.Update(transaction);
      }

      public bool Delete(long transactionId)
      {
         var transaction = _repository.FindById<ITransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId || transaction.ParentId != null)
            return false;

         return _repository.Delete(transaction);
      }
   }
}
