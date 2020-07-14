﻿using System;

namespace MyMoney.Web.Models.Entity
{
    public class TransactionModel : EntityModel
    {
        public string Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }

        public TransactionModel()
        {

        }

        public TransactionModel(TransactionModel other)
        {
            Id = other.Id;
            Update(other);
        }

        public void Update(TransactionModel other)
        {
            Date = other.Date;
            Description = other.Description;
            Amount = other.Amount;
        }
    }
}
