using MyMoney.Core.Interfaces.Entities;
using System;

namespace MyMoney.Web.Models.Entity
{
    public class BudgetModel : EntityModel
    {
        public decimal Amount { get; set; }
        public string MonthId { get; set; }
        public string Name { get; set;  }
        public string Notes { get; set; }

        public BudgetModel()
        {

        }

        public BudgetModel(IBudget model) : base(model.Id)
        {
            Amount = model.Amount;
            MonthId = model.MonthId;
            Name = model.Name;
            Notes = model.Notes;
        }
    }
}
