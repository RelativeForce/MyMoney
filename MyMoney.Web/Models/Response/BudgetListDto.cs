using MyMoney.Web.Models.Entity;
using System.Collections.Generic;

namespace MyMoney.Web.Models.Response
{
   public class BudgetListDto
   {
      public List<BudgetDto> Budgets { get; set; } = new List<BudgetDto>();
   }
}
