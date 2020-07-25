using System;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
    public interface ITransaction : IBaseEntity
    {
        DateTime Date { get; set; }
        string Description { get; set; }
        decimal Amount { get; set; }
        long UserId { get; set; }

        IUser User { get; set; }
        IQueryable<IBudget> Budgets { get; }
    }
}
