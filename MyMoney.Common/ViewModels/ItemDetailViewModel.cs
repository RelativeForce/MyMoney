using MyMoney.Client.Models.DTO;
using MyMoney.Common.Models;

namespace MyMoney.Common.ViewModels
{
    public class ItemDetailViewModel : BaseViewModel
    {
        public TransactionModel Item { get; set; }
        public ItemDetailViewModel(TransactionModel item = null)
        {
            Title = "Edit";
            Item = item;
        }
    }
}
