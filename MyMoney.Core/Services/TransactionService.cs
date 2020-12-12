﻿using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
   public sealed class TransactionService : ITransactionService
   {
      private readonly IRepository _repository;
      private readonly IRelationRepository _relationRepository;
      private readonly IEntityFactory _entityFactory;
      private readonly ICurrentUserProvider _currentUserProvider;

      public TransactionService(IRepository repository, IRelationRepository relationRepository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _relationRepository = relationRepository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
      }

      public ITransaction Find(long transactionId)
      {
         var transaction = _repository.FindById<ITransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return null;

         return transaction;
      }

      public IList<ITransaction> Between(DateTime start, DateTime end)
      {
         return _currentUserProvider.CurrentUser.Transactions
            .Where(t => t.Date >= start && t.Date <= end)
            .OrderByDescending(t => t.Date)
            .ToList(); ;
      }

      public ITransaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds)
      {
         if (string.IsNullOrWhiteSpace(description))
            return null;

         if (notes == null)
            notes = "";

         var user = _currentUserProvider.CurrentUser;

         var transaction = _entityFactory.NewTransaction;
         transaction.Date = date;
         transaction.Description = description;
         transaction.Amount = amount;
         transaction.UserId = user.Id;
         transaction.User = user;
         transaction.Notes = notes;

         var addedTransaction = _repository.Add(transaction);

         if (addedTransaction == null)
         {
            return null;
         }

         // Budgets
         var budgets = user.Budgets.Where(b => budgetIds.Contains(b.Id)).ToList();

         foreach (var budget in budgets)
         {
            budget.AddTransaction(_relationRepository, addedTransaction);
         }

         // Incomes
         var incomes = user.Incomes.Where(i => incomeIds.Contains(i.Id)).ToList();

         foreach (var income in incomes)
         {
            income.AddTransaction(_relationRepository, addedTransaction);
         }

         return _repository.Update(addedTransaction) ? addedTransaction : null;
      }

      public bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds)
      {
         if (string.IsNullOrWhiteSpace(description))
            return false;

         if (notes == null)
            notes = "";

         var transaction = _repository.FindById<ITransaction>(transactionId);
         var user = _currentUserProvider.CurrentUser;

         if (transaction == null || transaction.UserId != user.Id)
            return false;

         transaction.Amount = amount;
         transaction.Date = date;
         transaction.Description = description;
         transaction.Notes = notes;

         // Budgets
         foreach (var budget in transaction.Budgets.ToList())
         {
            budget.RemoveTransaction(_relationRepository, transaction);
         }

         var budgets = user.Budgets.Where(b => budgetIds.Contains(b.Id)).ToList();

         foreach (var budget in budgets)
         {
            budget.AddTransaction(_relationRepository, transaction);
         }

         // Incomes
         foreach (var income in transaction.Incomes.ToList())
         {
            income.RemoveTransaction(_relationRepository, transaction);
         }

         var incomes = user.Incomes.Where(i => incomeIds.Contains(i.Id)).ToList();

         foreach (var income in incomes)
         {
            income.AddTransaction(_relationRepository, transaction);
         }

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
