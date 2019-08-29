using System;
using System.ComponentModel;
using MyMoney.Client.Models.Entity;
using MyMoney.Common.Models;
using MyMoney.Common.ViewModels;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class TransactionDetailPage : ContentPage
    {
        TransactionDetailViewModel viewModel;

        public TransactionDetailPage(TransactionDetailViewModel viewModel)
        {
            InitializeComponent();

            BindingContext = this.viewModel = viewModel;
        }

        public TransactionDetailPage()
        {
            InitializeComponent();

            var item = new TransactionModel
            {
                Date = DateTime.Now,
                Description = "This is an item description.",
                Amount = 0
            };

            viewModel = new TransactionDetailViewModel(item);
            BindingContext = viewModel;
        }

        public async void Delete_Clicked(object sender, EventArgs e)
        {
            var delete = await App.RootPage.DisplayAlert("Delete Transaction", "Are you sure you want to delete this transaction?", "Yes" ,"No");

            if (delete)
            {
                MessagingCenter.Send(this, "DeleteTransaction", viewModel.Transaction);
                await Navigation.PopAsync();
            }
        }

        public async void Update_Clicked(object sender, EventArgs e)
        {
            MessagingCenter.Send(this, "UpdateTransaction", viewModel.Transaction);
            await Navigation.PopAsync();
        }
    }
}