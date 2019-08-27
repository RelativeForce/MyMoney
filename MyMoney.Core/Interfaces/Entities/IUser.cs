using System;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
    public interface IUser : IBaseEntity
    {
        string Email { get; set; }
        string PasswordHash { get; set; }
        DateTime DateOfBirth { get; set; }
        string FullName { get; set; }

        IQueryable<ITransaction> Transactions { get; }
        IQueryable<IBudget> Budgets { get; }
    }
}
