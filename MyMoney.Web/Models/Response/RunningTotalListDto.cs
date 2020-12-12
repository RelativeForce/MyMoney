using MyMoney.Web.Models.Entity;
using System.Collections.Generic;

namespace MyMoney.Web.Models.Response
{
   public class RunningTotalListDto
   {
      public List<RunningTotalDto> RunningTotals { get; set; } = new List<RunningTotalDto>();
   }
}
