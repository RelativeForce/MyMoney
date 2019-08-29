using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;
using MyMoney.Common.Models;
using MyMoney.Common.Views;
using Xamarin.Forms;

namespace MyMoney.Common.ViewModels
{
    public class ItemsViewModel : BaseViewModel
    {
        public ObservableCollection<TransactionModel> Items { get; set; }
        public Command LoadItemsCommand { get; set; }

        public ItemsViewModel()
        {
            Title = "Transactions";
            Items = new ObservableCollection<TransactionModel>();
            LoadItemsCommand = new Command(async () => await ExecuteLoadItemsCommand());

            MessagingCenter.Subscribe<NewItemPage, TransactionModel>(this, "AddItem", async (obj, item) =>
            {
                using (var client = App.NewApiClient)
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

                        var newItem = await client.TransactionApi.Add(item);

                        Items.Add(newItem);
                    }
                    catch (Exception ex)
                    {
                        await App.RootPage.DisplayAlert("Add Transaction Failed", "Server Error", "Close");
                    }
                }
            });
        }

        async Task ExecuteLoadItemsCommand()
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                Items.Clear();

                using (var client = App.NewApiClient)
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

                        var list = await client.TransactionApi.List(new TransactionListRequest());

                        foreach (var item in list.Transactions)
                        {
                            Items.Add(item);
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
    }
}