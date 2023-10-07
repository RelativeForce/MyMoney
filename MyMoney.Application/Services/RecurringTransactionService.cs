using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Application.Interfaces;
using MyMoney.Application.Interfaces.Services;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces;
using MyMoney.Infrastructure.Entities;
using MyMoney.Infrastructure.EntityFramework;

namespace MyMoney.Application.Services
{
   public sealed class RecurringTransactionService : IRecurringTransactionService
   {
      private readonly IRepository _repository;
      private readonly ICurrentUserProvider _currentUserProvider;

      public RecurringTransactionService(IRepository repository, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _currentUserProvider = currentUserProvider;
      }

      public IEnumerable<Transaction> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var recurring = _repository
            .UserFiltered<RecurringTransaction>(userId)
            .Where(rt =>
               (rt.Start >= start && rt.Start <= end) || // Starts in the range
               (rt.End >= start && rt.End <= end) || // Ends in the range
               (rt.Start <= start && rt.End >= end)) // Spans the range
            .IncludeChildren()
            .AsEnumerable()
            .Select(rt => rt.Children(t => t.Date >= start && t.Date <= end))
            .SelectMany(vt => vt);

         return recurring;
      }

      public RecurringTransaction Add(DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         if (start > end)
         {
            (start, end) = (end, start);
         }

         var user = _currentUserProvider.CurrentUser;

         var transaction = new RecurringTransaction
         {
            Start = start,
            End = end,
            Recurrence = period,
            Description = description,
            Amount = amount,
            UserId = user.Id,
            User = user,
            Notes = notes
         };

         return _repository.Add(transaction);
      }

      public Transaction Realise(long recurringTransactionId, DateTime date)
      {
         var recurring = Find(recurringTransactionId);
         if (recurring == null)
            return null;

         var user = _currentUserProvider.CurrentUser;

         var transaction = new Transaction
         {
            Date = date,
            Description = recurring.Description,
            Amount = recurring.Amount,
            UserId = user.Id,
            User = user,
            Notes = string.Empty,
            Parent = recurring,
            ParentId = recurring.Id
         };

         return _repository.Add(transaction);
      }

      public RecurringTransaction Find(long transactionId)
      {
         var userId = _currentUserProvider.CurrentUserId;
         
         return _repository
            .UserFiltered<RecurringTransaction>(userId)
            .IncludeChildren()
            .FirstOrDefault(rt => rt.Id == transactionId);
      }

      public bool Update(long transactionId, DateTime start, DateTime end, string description, decimal amount, string notes, Frequency period)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return false;

         notes ??= string.Empty;

         if (start > end)
         {
            (start, end) = (end, start);
         }

         var transaction = Find(transactionId);

         if (transaction == null)
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

         var children = transaction.RealChildren;

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
         var transaction = Find(transactionId);
         var userId = _currentUserProvider.CurrentUserId;

         if (transaction == null || transaction.UserId != userId)
            return false;

         if (!_repository.DeleteRange(transaction.RealChildren))
            return false;

         return _repository.Delete(transaction);
      }
   }
}
