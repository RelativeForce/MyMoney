using MyMoney.Client.Models.Entity;

namespace MyMoney.Common.ViewModels
{
    public class TransactionDetailViewModel : BaseViewModel
    {
        public TransactionModel Transaction { get; set; }

        private bool _isEdit = false;
        public bool IsEdit
        {
            get => _isEdit;
            set => SetProperty(ref _isEdit, value);
        }

        private bool _isView = true;
        public bool IsView
        {
            get => _isView;
            set => SetProperty(ref _isView, value);
        }

        public TransactionDetailViewModel(TransactionModel transaction)
        {
            Title = $"Transaction {transaction.Id}";
            Transaction = new TransactionModel(transaction);
        }
    }
}
