using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Web.Models.Entity
{
    public class TransactionModel : EntityModel
    {
        public string Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }

        public TransactionModel()
        {

        }

        public TransactionModel(ITransaction model) : base(model.Id)
        {
            Date = model.Date.ToShortDateString();
            Description = model.Description;
            Amount = model.Amount;
        }
    }
}
