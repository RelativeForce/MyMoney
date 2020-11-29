using MyMoney.Web.Models.Entity;
using System.Collections.Generic;

namespace MyMoney.Web.Models.Response
{
   public class IncomeListDto
   {
      public List<IncomeDto> Incomes { get; set; } = new List<IncomeDto>();
   }
}
