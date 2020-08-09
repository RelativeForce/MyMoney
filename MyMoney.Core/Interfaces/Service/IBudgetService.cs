using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IBudgetService
    {
        IBudget Add(string monthId, string name, decimal amount, string notes);
        List<IBudget> List(string monthId);
        bool Update(long budgetId, string name, decimal amount, string notes);
    }
}
