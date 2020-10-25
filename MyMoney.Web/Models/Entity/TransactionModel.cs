using MyMoney.Core.Interfaces.Entities;
using System.Linq;

namespace MyMoney.Web.Models.Entity
{
   public class TransactionModel : EntityModel
   {
      public string Date { get; set; }
      public string Description { get; set; }
      public decimal Amount { get; set; }
      public long[] BudgetIds { get; set; }

      public TransactionModel()
      {

      }

      public TransactionModel(ITransaction model, bool useJavaScriptDate = false) : base(model.Id)
      {
         Date = useJavaScriptDate ? model.Date.ToString("yyyy-MM-dd") : model.Date.ToShortDateString();
         Description = model.Description;
         Amount = model.Amount;
         BudgetIds = model.Budgets.Select(t => t.Id).ToArray();
      }
   }
}
