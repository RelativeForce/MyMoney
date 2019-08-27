using System;
using MyMoney.Core.Interfaces.Entites;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IBudgetService
    {
        IBudget Add(DateTime month, decimal amount);
        IBudget Find(DateTime month);
    }
}
