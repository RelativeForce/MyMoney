using System;

namespace MyMoney.Core.Interfaces.Entites
{
    public interface ITransaction : IBaseEntity
    {
        DateTime Date { get; set; }
        string Description { get; set; }
        decimal Amount { get; set; }
        long UserId { get; set; }

        IUser User { get; set; }
    }
}
