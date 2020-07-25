using System;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IBudgetService
    {
        IBudget Add(string monthId, string name, decimal amount, string notes);
        IBudget Find(string monthId);
    }
}
