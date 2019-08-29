using System;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface ITransactionService
    {
        ITransaction Add(IUser user, DateTime date, string description, decimal amount);
        bool Update(ITransaction transaction);
        bool Delete(IUser user, long transactionId);
    }
}
