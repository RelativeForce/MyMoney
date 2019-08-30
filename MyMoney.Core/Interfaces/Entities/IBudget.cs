using System;

namespace MyMoney.Core.Interfaces.Entities
{
    public interface IBudget : IBaseEntity
    {
        decimal Amount { get; set; }
        DateTime Start { get; set; }
        DateTime End { get; set; }
        string Notes { get; set; }
        long UserId { get; set; }

        IUser User { get; set; }
    }
}
