using MyMoney.Web.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMoney.Web.Models.Request
{
   public class RunningTotalSearchDto
   {
      public decimal InitialTotal { get; set; }
      public DateRangeDto dateRange { get; set; }
   }
}
