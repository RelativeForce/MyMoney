using MyMoney.Client.Models.DTO;

namespace MyMoney.Common.ViewModels
{
    public class TransactionDetailViewModel : BaseViewModel
    {
        public TransactionModel Transaction { get; set; }
        public TransactionDetailViewModel(TransactionModel transaction = null)
        {
            Title = "Edit";
            Transaction = transaction;
        }
    }
}
