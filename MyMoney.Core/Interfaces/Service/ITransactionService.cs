using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface ITransactionService
    {
        IList<ITransaction> Between(DateTime start, DateTime end);
        ITransaction Add(DateTime date, string description, decimal amount);
    }
}
