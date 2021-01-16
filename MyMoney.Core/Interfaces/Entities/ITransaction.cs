using MyMoney.Core.Interfaces.Entities.Abstract;
using System;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface ITransaction : IUserFilteredEntity
   {
      DateTime Date { get; set; }
      string Description { get; set; }
      string Notes { get; set; }
      decimal Amount { get; set; }
      public long? ParentId { get; set; }
      IRecurringTransaction Parent { get; set; }

      IQueryable<IBudget> Budgets { get; }
      IQueryable<IIncome> Incomes { get; }
   }
}