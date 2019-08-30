using System;

namespace MyMoney.Client.Models.Entity
{
    public class BudgetModel
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Notes { get; set; }
    }
}
