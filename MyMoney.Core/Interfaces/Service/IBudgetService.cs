using System;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IBudgetService
    {
        IBudget Add(DateTime month, decimal amount);
        IBudget Find(DateTime month);
    }
}
