﻿using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
    public interface IBudget : IBaseEntity
    {
        string MonthId { get; set; }
        decimal Amount { get; set; }
        string Name { get; set; }
        string Notes { get; set; }
        long UserId { get; set; }

        IUser User { get; set; }
        IQueryable<ITransaction> Transactions { get; }
        void AddTransaction(ITransaction transaction);
    }
}
