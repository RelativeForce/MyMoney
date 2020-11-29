using MyMoney.Core.Interfaces.Entities;
using System.Linq;

namespace MyMoney.Web.Models.Entity
{
   public class TransactionDto : EntityDto
   {
      public string Date { get; set; }
      public string Description { get; set; }
      public string Notes { get; set; }
      public decimal Amount { get; set; }
      public long[] BudgetIds { get; set; }

      public TransactionDto()
      {

      }

      public TransactionDto(ITransaction model, bool useJavaScriptDate = false) : base(model.Id)
      {
         Date = useJavaScriptDate ? model.Date.ToString("yyyy-MM-dd") : model.Date.ToShortDateString();
         Description = model.Description;
         Notes = model.Notes;
         Amount = model.Amount;
         BudgetIds = model.Budgets.Select(t => t.Id).ToArray();
      }
   }
}
