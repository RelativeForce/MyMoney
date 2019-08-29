using System;

namespace MyMoney.Client.Models.Entity
{
    public class TransactionModel
    {
        public long Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }

        public TransactionModel()
        {

        }

        public TransactionModel(TransactionModel other)
        {
            Id = other.Id;
            Date = other.Date;
            Description = other.Description;
            Amount = other.Amount;
        }
    }
}
