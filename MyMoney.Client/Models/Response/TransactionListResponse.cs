using System;
using System.Collections.Generic;
using MyMoney.Client.Models.DTO;

namespace MyMoney.Client.Models.Response
{
    public class TransactionListResponse
    {
        public List<TransactionModel> Transactions { get; set; } = new List<TransactionModel>();
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}
