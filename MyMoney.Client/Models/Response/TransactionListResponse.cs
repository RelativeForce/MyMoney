using System;
using System.Collections.Generic;
using MyMoney.Client.Models.DTO;

namespace MyMoney.Client.Models.Response
{
    public class TransactionListResponse
    {
        public List<TransactionModel> Transactions { get; set; } = new List<TransactionModel>();
        public DateRangeModel DateRange { get; set; } = new DateRangeModel();
    }
}
