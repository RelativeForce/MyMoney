using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;
using MyMoney.Common.Views;
using Xamarin.Forms;

namespace MyMoney.Common.ViewModels
{
    public class TransactionListViewModel : BaseViewModel
    {
        public ObservableCollection<TransactionModel> Transactions { get; set; }
        public Command LoadItemsCommand { get; set; }

        public TransactionListViewModel()
        {
            Title = "Transactions";
            Transactions = new ObservableCollection<TransactionModel>();
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
                Transactions.Clear();

                using (var client = App.NewApiClient())
                {
                    try
                    {
                        var authenticate = await client.UserApi.Authenticate();

                        if (!authenticate)
                        {
                            await App.RootPage.DisplayAlert("Authentication Failed", "Returning to login...", "Close");
                            App.LogOut();
                            return;
                        }

                        var list = await client.TransactionApi.List(new DateRangeModel());

                        foreach (var item in list.Transactions)
                        {
                            Transactions.Add(item);
                        }
                    }
                    catch (Exception ex)
                    {
                        await App.RootPage.DisplayAlert("Transaction List Failed", "Server Error", "Close");
                    }
                }
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
                using (var client = App.NewApiClient())
                {
                    try
                    {
                        var authenticate = await client.UserApi.Authenticate();

                        if (!authenticate)
                        {
                            await App.RootPage.DisplayAlert("Authentication Failed", "Returning to login...", "Close");
                            App.LogOut();
                            return;
                        }

                        var newItem = await client.TransactionApi.Add(transaction);

                        Transactions.Add(newItem);
                    }
                    catch (Exception ex)
                    {
                        await App.RootPage.DisplayAlert("Add Transaction Failed", "Server Error", "Close");
                    }
                }
            });

            MessagingCenter.Subscribe<TransactionDetailPage, TransactionModel>(this, "DeleteTransaction", async (obj, transaction) =>
            {
                using (var client = App.NewApiClient())
                {
                    try
                    {
                        var authenticate = await client.UserApi.Authenticate();

                        if (!authenticate)
                        {
                            await App.RootPage.DisplayAlert("Authentication Failed", "Returning to login...", "Close");
                            App.LogOut();
                            return;
                        }

                        var newItem = await client.TransactionApi.Delete(new DeleteRequest(transaction.Id));

                        if (newItem.Success)
                        {
                            Transactions.Remove(transaction);
                        }
                        else
                        {
                            await App.RootPage.DisplayAlert("Delete Transaction Failed", "Server Error", "Close");
                        }
                    }
                    catch (Exception ex)
                    {
                        await App.RootPage.DisplayAlert("Delete Transaction Failed", "Server Error", "Close");
                    }
                }
            });
        }
    }
}