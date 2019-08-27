using System;

namespace MyMoney.Client.Models.Request
{
    public class TransactionListRequest
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}
