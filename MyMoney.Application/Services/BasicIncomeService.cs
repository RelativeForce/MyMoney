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
   public sealed class BasicIncomeService : IBasicIncomeService
   {
      private readonly IRepository _repository;
      private readonly ICurrentUserProvider _currentUserProvider;

      public BasicIncomeService(IRepository repository, ICurrentUserProvider currentUserProvider)
      {
         _repository = repository;
         _currentUserProvider = currentUserProvider;
      }

      public Income Find(long incomeId)
      {
         var userId = _currentUserProvider.CurrentUserId;
         
         return _repository
            .UserFiltered<Income>(userId)
            .Include(i => i.Parent)
            .Include(i => i.TransactionsProxy)
            .ThenInclude(t => t.Transaction)
            .AsSplitQuery()
            .FirstOrDefault(i => i.Id == incomeId);
      }

      public Income Add(DateTime date, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return null;

         notes ??= string.Empty;

         var user = _currentUserProvider.CurrentUser;

         var income = new Income
         {
            UserId = user.Id,
            User = user,
            Amount = amount,
            Date = date,
            Name = name,
            Notes = notes
         };

         return _repository.Add(income);
      }

      public IEnumerable<Income> From(DateTime start, int count)
      {
         if (count <= 0)
            return new List<Income>();

         var userId = _currentUserProvider.CurrentUserId;

         return _repository
            .UserFiltered<Income>(userId)
            .Where(i => i.ParentId == null)
            .Where(i => i.Date <= start)
            .Include(i => i.TransactionsProxy)
            .ThenInclude(t => t.Transaction)
            .AsSplitQuery()
            .OrderByDescending(i => i.Date)
            .Take(count)
            .AsEnumerable();
      }

      public IEnumerable<Income> Between(DateTime start, DateTime end)
      {
         var userId = _currentUserProvider.CurrentUserId;

         return _repository
            .UserFiltered<Income>(userId)
            .Where(i => i.ParentId == null)
            .Where(i => i.Date >= start && i.Date <= end)
            .AsEnumerable();
      }

      public bool Update(long incomeId, DateTime date, string name, decimal amount, string notes)
      {
         if (string.IsNullOrWhiteSpace(name) || amount < 0.01m)
            return false;

         notes ??= string.Empty;

         var income = Find(incomeId);

         if (income == null)
            return false;

         var basicDataHasChanged =
            income.Amount != amount ||
            income.Date != date ||
            income.Name != name;

         // Cannot edit the basic data of a recurring income child
         if (income.ParentId != null && basicDataHasChanged)
            return false;

         income.Amount = amount;
         income.Date = date;
         income.Name = name;
         income.Notes = notes;

         return _repository.Update(income);
      }

      public bool Delete(long incomeId)
      {
         var income = Find(incomeId);

         if (income == null)
            return false;

         return _repository.Delete(income);
      }
   }
}
