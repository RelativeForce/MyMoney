using MyMoney.Web.Models.Entity;
using System.Collections.Generic;

namespace MyMoney.Web.Models.Response
{
    public class TransactionListResponse
    {
        public List<TransactionModel> Transactions { get; set; } = new List<TransactionModel>();
    }
}
