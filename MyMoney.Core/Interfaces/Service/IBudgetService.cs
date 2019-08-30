using System;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IBudgetService
    {
        IBudget Add(IUser user, DateTime start, DateTime end, decimal amount, string notes);
        IBudget Find(IUser user, DateTime date);
    }
}
