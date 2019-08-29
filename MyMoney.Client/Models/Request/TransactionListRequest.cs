using System;

namespace MyMoney.Client.Models.Request
{
    public class TransactionListRequest
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public TransactionListRequest()
        {
            End = DateTime.Now;
            Start = DateTime.Now.AddMonths(-1);
        }
    }
}
