using MyMoney.Core.Interfaces.Entities;
using System.Linq;

namespace MyMoney.Web.Models.Entity
{
   public class BudgetModel : EntityModel
   {
      public decimal Amount { get; set; }
      public string MonthId { get; set; }
      public string Name { get; set; }
      public string Notes { get; set; }
      public decimal Remaining { get; set; }

      public BudgetModel()
      {

      }

      public BudgetModel(IBudget model) : base(model.Id)
      {
         Amount = model.Amount;
         MonthId = model.MonthId;
         Name = model.Name;
         Notes = model.Notes;
         Remaining = model.Amount - model.Transactions.Select(b => b.Amount).Sum();
      }
   }
}
