using MyMoney.Web.Models.Common;

namespace MyMoney.Web.Models.Request
{
   public class RunningTotalSearchDto
   {
      public decimal InitialTotal { get; set; }
      public DateRangeDto DateRange { get; set; }
   }
}
