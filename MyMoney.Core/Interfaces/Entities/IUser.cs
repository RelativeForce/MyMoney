﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
    public interface IUser : IBaseEntity
    {
        string Email { get; set; }
        string PasswordHash { get; set; }
        string Salt { get; set; }
        DateTime DateOfBirth { get; set; }
        string FullName { get; set; }

        IQueryable<ITransaction> Transactions { get; }
        IQueryable<IBudget> Budgets { get; }
        IList<ITransaction> Between(DateTime start, DateTime end);
        decimal Total(DateTime start, DateTime end);
    }
}
