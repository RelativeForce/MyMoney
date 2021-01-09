﻿using MyMoney.Core.Interfaces.Entities.Abstract;
using System;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface ITransaction : IBaseEntity
   {
      DateTime Date { get; set; }
      string Description { get; set; }
      string Notes { get; set; }
      decimal Amount { get; set; }
      long UserId { get; set; }
      long? RecurringTransactionId { get; set; }

      IUser User { get; set; }
      IQueryable<IBudget> Budgets { get; }
      IQueryable<IIncome> Incomes { get; }
   }
}