using MyMoney.Core.Interfaces.Entities;
using System.Linq;

namespace MyMoney.Web.Models.Entity
{
   public class IncomeDto : EntityDto
   {
      public string Date { get; set; }
      public string Name { get; set; }
      public decimal Amount { get; set; }

      public IncomeDto()
      {

      }

      public IncomeDto(IIncome model, bool useJavaScriptDate = false) : base(model.Id)
      {
         Date = useJavaScriptDate ? model.Date.ToString("yyyy-MM-dd") : model.Date.ToShortDateString();
         Name = model.Name;
         Amount = model.Amount;
      }
   }
}
