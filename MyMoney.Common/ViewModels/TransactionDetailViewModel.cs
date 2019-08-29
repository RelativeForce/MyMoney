﻿using MyMoney.Client.Models.Entity;

namespace MyMoney.Common.ViewModels
{
    public class TransactionDetailViewModel : BaseViewModel
    {
        public TransactionModel Transaction { get; set; }

        public TransactionDetailViewModel(TransactionModel transaction)
        {
            Title = $"View Transaction {transaction.Id}";
            Transaction = transaction;
        }
    }
}
