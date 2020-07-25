using MyMoney.Core.Interfaces.Entities;
using System.Linq;

namespace MyMoney.Web.Models.Entity
{
    public class TransactionModel : EntityModel
    {
        public string Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public long[] BudgetIds { get; set; }

        public TransactionModel()
        {

        }

        public TransactionModel(ITransaction model) : base(model.Id)
        {
            Date = model.Date.ToShortDateString();
            Description = model.Description;
            Amount = model.Amount;
            BudgetIds = model.Budgets.Select(t => t.Id).ToArray();
        }
    }
}
