using System;

namespace MyMoney.Client.Models.Common
{
    public class DateRangeModel
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public DateRangeModel()
        {
            End = DateTime.Now;
            Start = DateTime.Now.AddMonths(-1);
        }
    }
}
