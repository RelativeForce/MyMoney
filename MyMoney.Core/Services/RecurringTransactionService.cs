using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
   public sealed class RecurringTransactionService : IRecurringTransactionService
   {
      private readonly IRepository _repository;
      private readonly IEntityFactory _entityFactory;
      private readonly ICurrentUserProvider _currentUserProvider;

      public RecurringTransactionService(IRepository repository, IEntityFactory entityFactory, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _entityFactory = entityFactory;
         _currentUserProvider = currentUserProvider;
      }

      public IEnumerable<ITransaction> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<IRecurringTransaction>(userId)
            .Where(rt =>
               (rt.Start >= start && rt.Start <= end) || // Starts in the range
               (rt.End >= start && rt.End <= end) || // Ends in the range
               (rt.Start <= start && rt.End >= end)) // Spans the range
            .AsEnumerable()
            .Select(rt => rt.Children(_repository, t => t.Date >= start && t.Date <= end))
            .SelectMany(vt => vt);

         return recurring;
      }

      public IRecurringTransaction Add(DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

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

      public ITransaction Realise(long recurringTransactionId, DateTime date)
      {
         var recurring = Find(recurringTransactionId);
         if (recurring == null)
            return null;

         var user = _currentUserProvider.CurrentUser;

         var transaction = _entityFactory.NewTransaction;

         transaction.Date = date;
         transaction.Description = recurring.Description;
         transaction.Amount = recurring.Amount;
         transaction.UserId = user.Id;
         transaction.User = user;
         transaction.Notes = string.Empty;
         transaction.Parent = recurring;
         transaction.ParentId = recurring.Id;

         return _repository.Add(transaction);
      }

      public IRecurringTransaction Find(long transactionId)
      {
         var transaction = _repository.FindById<IRecurringTransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return null;

         return transaction;
      }

      public IList<ITransaction> GetChildTransactions(IRecurringTransaction recurringTransaction)
      {
         return recurringTransaction.Children(_repository);
      }

      public bool Update(long transactionId, DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return false;

         notes ??= string.Empty;

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

         var clearChildren = transaction.Start != start || transaction.Recurrence != period;
         var trimBounds = transaction.End != end && !clearChildren;

         transaction.Start = start;
         transaction.End = end;
         transaction.Recurrence = period;
         transaction.Description = description;
         transaction.Amount = amount;
         transaction.Notes = notes;

         if (!_repository.Update(transaction))
            return false;

         var children = _repository
            .UserFiltered<ITransaction>(user)
            .Where(t => t.ParentId == transactionId)
            .ToList();

         if (clearChildren)
            return _repository.DeleteRange(children);

         if (trimBounds)
         {
            var invalidChildren = children.Where(t => t.Date > end);

            if (!_repository.DeleteRange(invalidChildren))
               return false;

            children = children.Where(t => t.Date <= end).ToList();
         }

         foreach (var child in children)
         {
            child.Description = description;
            child.Amount = amount;
         }

         return _repository.UpdateRange(children);
      }

      public bool Delete(long transactionId)
      {
         var transaction = _repository.FindById<IRecurringTransaction>(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return false;

         var children = _repository
            .UserFiltered<ITransaction>(userId)
            .Where(t => t.ParentId == transactionId)
            .ToList();

         foreach (var child in children)
         {
            if (!_repository.Delete(child))
               return false;
         }

         return _repository.Delete(transaction);
      }
   }
}
