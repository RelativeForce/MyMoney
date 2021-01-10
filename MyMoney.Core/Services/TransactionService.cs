using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Data;
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

      public IList<ITransaction> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<IRecurringTransaction>(userId)
            .Where(rt =>
               (rt.Start >= start && rt.Start <= end) || // Starts in the range
               (rt.End >= start && rt.End <= end) || // Ends in the range
               (rt.Start <= start && rt.End >= end)) // Spans the range
            .AsEnumerable()
            .Select(rt => rt.ToInstances())
            .SelectMany(vt => vt)
            .Where(t => t.Date >= start && t.Date <= end);

         var basic = _repository
            .UserFiltered<ITransaction>(userId)
            .Where(t => t.Date >= start && t.Date <= end)
            .AsEnumerable();

         return basic
            .Concat(recurring)
            .OrderByDescending(t => t.Date)
            .ToList();
      }

      #region Basic

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
         var budgets = _repository
            .UserFiltered<IBudget>(user)
            .Where(b => budgetIds.Contains(b.Id))
            .ToList();

         foreach (var budget in budgets)
         {
            budget.AddTransaction(_relationRepository, addedTransaction);
         }

         // Incomes
         var incomes = _repository
            .UserFiltered<IIncome>(user)
            .Where(i => incomeIds.Contains(i.Id))
            .ToList();

         foreach (var income in incomes)
         {
            income.AddTransaction(_relationRepository, addedTransaction);
         }

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

         var budgets = _repository
            .UserFiltered<IBudget>(user)
            .Where(b => budgetIds.Contains(b.Id))
            .ToList();

         foreach (var budget in budgets)
         {
            budget.AddTransaction(_relationRepository, transaction);
         }

         // Incomes
         foreach (var income in transaction.Incomes.ToList())
         {
            income.RemoveTransaction(_relationRepository, transaction);
         }

         var incomes = _repository
            .UserFiltered<IIncome>(user)
            .Where(i => incomeIds.Contains(i.Id))
            .ToList();

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

      #endregion Basic

      #region Recurring

      public IRecurringTransaction AddRecurring(DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(description))
            return null;

         if (notes == null)
            notes = "";

         if (start > end)
         {
            var temp = start;
            start = end;
            end = temp;
         }

         var user = _currentUserProvider.CurrentUser;

         var transaction = _entityFactory.NewRecurringTransaction;
         transaction.Start = start;
         transaction.End = end;
         transaction.Recurrence = period;
         transaction.Description = description;
         transaction.Amount = amount;
         transaction.UserId = user.Id;
         transaction.User = user;
         transaction.Notes = notes;

         return _repository.Add(transaction);
      }

      public IRecurringTransaction FindRecurring(long transactionId)
      {
         var transaction = _repository.FindById<IRecurringTransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return null;

         return transaction;
      }

      public bool UpdateRecurring(long transactionId, DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(description))
            return false;

         if (notes == null)
            notes = "";

         if (start > end)
         {
            var temp = start;
            start = end;
            end = temp;
         }

         var transaction = _repository.FindById<IRecurringTransaction>(transactionId);
         var user = _currentUserProvider.CurrentUser;

         if (transaction == null || transaction.UserId != user.Id)
            return false;

         transaction.Start = start;
         transaction.End = end;
         transaction.Recurrence = period;
         transaction.Description = description;
         transaction.Amount = amount;
         transaction.Notes = notes;

         return _repository.Update(transaction);
      }

      public bool DeleteRecurring(long transactionId)
      {
         var transaction = _repository.FindById<IRecurringTransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return false;

         return _repository.Delete(transaction);
      }

      #endregion Recurring
   }
}
