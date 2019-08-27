using System;
using MyMoney.Core.Interfaces.Entites;

namespace MyMoney.Infrastructure.Entities
{
    public class Transaction : BaseEntity, ITransaction
    {
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
    }
}
