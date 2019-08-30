using System;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface ITransactionService
    {
        ITransaction Add(DateTime date, string description, decimal amount);
        bool Update(long transactionId, DateTime date, string description, decimal amount);
        bool Delete(long transactionId);
    }
}
