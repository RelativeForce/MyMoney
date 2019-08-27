using System;
using MyMoney.Core.Interfaces.Entites;

namespace MyMoney.Infrastructure.Entities
{
    public class Budget : BaseEntity, IBudget
    {
        public decimal Amount { get; set; }
        public DateTime Month { get; set; }
    }
}
