using System;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IBudgetService
    {
        IBudget Add(IUser user, DateTime month, decimal amount);
        IBudget Find(IUser user, DateTime month);
    }
}
