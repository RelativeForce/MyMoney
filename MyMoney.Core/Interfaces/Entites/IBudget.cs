using System;

namespace MyMoney.Core.Interfaces.Entites
{
    public interface IBudget : IBaseEntity
    {
        decimal Amount { get; set; }
        DateTime Month { get; set; }
    }
}
