using System;

namespace MyMoney.Client.Models.Entity
{
    public class BudgetModel : EntityModel
    {
        public decimal Amount { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Notes { get; set; }

        public void Update(BudgetModel model)
        {
            Amount = model.Amount;
            Start = model.Start;
            End = model.End;
            Notes = model.Notes;
        }
    }
}
