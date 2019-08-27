using System;

namespace MyMoney.Client.Models.DTO
{
    public class TransactionModel
    {
        public long Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
    }
}
