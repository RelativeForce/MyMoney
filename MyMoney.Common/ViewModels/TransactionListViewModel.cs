using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MyMoney.Client.ApiExceptions;
using MyMoney.Client.Models.Common;
using MyMoney.Client.Models.Entity;
using MyMoney.Client.Models.Request;
using MyMoney.Common.Views;
using Xamarin.Forms;

namespace MyMoney.Common.ViewModels
{
    public class TransactionListViewModel : BaseViewModel
    {
        public ObservableCollection<TransactionModel> Transactions => App.DataStore.Transactions;
        public Command LoadItemsCommand { get; set; }

        public TransactionListViewModel()
        {
            Title = "Transactions";
            LoadItemsCommand = new Command(async () => await ExecuteLoadItemsCommand());

            SetupMessages();
        }

        public async Task ExecuteLoadItemsCommand()
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                await App.DataStore.ClearAndLoadTransactions(new DateRangeModel());
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
            finally
            {
                IsBusy = false;
            }
        }

        public void SetupMessages()
        {
            MessagingCenter.Subscribe<NewTransactionPage, TransactionModel>(this, "AddTransaction", async (obj, transaction) =>
            {
                await App.DataStore.AddTransaction(transaction);
            });

            MessagingCenter.Subscribe<TransactionDetailPage, TransactionModel>(this, "DeleteTransaction", async (obj, transaction) =>
            {
                await App.DataStore.DeleteTransaction(transaction);
            });

            MessagingCenter.Subscribe<TransactionDetailPage, TransactionModel>(this, "UpdateTransaction", async (obj, transaction) =>
            {
                await App.DataStore.UpdateTransaction(transaction);
            });
        }
    }
}