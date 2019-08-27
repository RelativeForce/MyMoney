using System;

namespace MyMoney.Core.Interfaces.Entities
{
    public interface IBudget : IBaseEntity
    {
        decimal Amount { get; set; }
        DateTime Month { get; set; }
        long UserId { get; set; }

        IUser User { get; set; }
    }
}
