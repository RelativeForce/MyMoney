﻿using System;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface ITransactionService
    {
        ITransaction Add(DateTime date, string description, decimal amount, long[] budgetIds);
        bool Update(long transactionId, DateTime date, string description, decimal amount, long[] budgetIds);
        bool Delete(long transactionId);
    }
}
