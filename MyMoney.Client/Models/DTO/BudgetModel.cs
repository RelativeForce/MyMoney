using System;

namespace MyMoney.Client.Models.DTO
{
    public class BudgetModel
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Month { get; set; }
    }
}
