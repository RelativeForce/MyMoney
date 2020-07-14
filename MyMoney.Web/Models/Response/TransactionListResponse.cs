using System;
using System.Collections.Generic;
using MyMoney.Web.Models.Entity;

namespace MyMoney.Web.Models.Response
{
    public class TransactionListResponse
    {
        public List<TransactionModel> Transactions { get; set; } = new List<TransactionModel>();
    }
}
