using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface ITransactionService
    {
        ITransaction Add(DateTime date, string description, decimal amount, List<IBudget> budgets);
        bool Update(long transactionId, DateTime date, string description, decimal amount);
        bool Delete(long transactionId);
    }
}
