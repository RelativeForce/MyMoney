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
            MessagingCenter.Send(this, "DeleteTransaction", viewModel.Transaction);
            await Navigation.PopAsync();
        }
    }
}