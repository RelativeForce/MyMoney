using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Application.Interfaces;
using MyMoney.Application.Interfaces.Services;
using MyMoney.Core.Interfaces;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Services
{
   public sealed class BasicTransactionService : IBasicTransactionService
   {
      private readonly IRepository _repository;
      private readonly IRelationRepository _relationRepository;
      private readonly ICurrentUserProvider _currentUserProvider;

      public BasicTransactionService(IRepository repository, IRelationRepository relationRepository, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _relationRepository = relationRepository;
         _currentUserProvider = currentUserProvider;
      }

      public IEnumerable<Transaction> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         var basic = _repository
            .UserFiltered<Transaction>(userId)
            .Where(t => t.ParentId == null)
            .Where(t => t.Date >= start && t.Date <= end)
            .Include(t => t.BudgetsProxy)
            .ThenInclude(p => p.Budget)
            .Include(t => t.IncomesProxy)
            .ThenInclude(p => p.Income)
            .AsSplitQuery()
            .AsEnumerable();

         return basic;
      }

      public Transaction Add(DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         var user = _currentUserProvider.CurrentUser;

         var transaction = new Transaction
         {
            Date = date,
            Description = description,
            Amount = amount,
            UserId = user.Id,
            User = user,
            Notes = notes,
            Parent = null,
            ParentId = null
         };

         var addedTransaction = _repository.Add(transaction);

         if (addedTransaction == null)
            return null;

         // Add relations
         transaction.UpdateBudgets(_repository, _relationRepository, budgetIds);
         transaction.UpdateIncomes(_repository, _relationRepository, incomeIds);

         return _repository.Update(addedTransaction) ? addedTransaction : null;
      }

      public Transaction Find(long transactionId)
      {
         var userId = _currentUserProvider.CurrentUserId;
         
         return _repository.UserFiltered<Transaction>(userId)
            .Include(t => t.Parent)
            .Include(t => t.BudgetsProxy)
            .ThenInclude(p => p.Budget)
            .Include(t => t.IncomesProxy)
            .ThenInclude(p => p.Income)
            .AsSplitQuery()
            .FirstOrDefault(t => t.Id == transactionId);
      }

      public bool Update(long transactionId, DateTime date, string description, decimal amount, string notes, long[] budgetIds, long[] incomeIds)
      {
         if (string.IsNullOrWhiteSpace(description) || amount < 0.01m)
            return false;

         notes ??= string.Empty;

         var transaction = Find(transactionId);

         if (transaction == null)
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
         var transaction = Find(transactionId);

         if (transaction == null || transaction.ParentId != null)
            return false;

         return _repository.Delete(transaction);
      }
   }
}
