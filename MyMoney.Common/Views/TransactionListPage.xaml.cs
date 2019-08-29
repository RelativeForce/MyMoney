using System;
using System.ComponentModel;
using MyMoney.Client.Models.DTO;
using MyMoney.Common.ViewModels;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class TransactionListPage : ContentPage
    {
        TransactionListViewModel viewModel;

        public TransactionListPage()
        {
            InitializeComponent();

            BindingContext = viewModel = new TransactionListViewModel();
        }

        async void OnTransactionSelected(object sender, SelectedItemChangedEventArgs args)
        {
            if (!(args.SelectedItem is TransactionModel item))
                return;

            await Navigation.PushAsync(new TransactionDetailPage(new TransactionDetailViewModel(item)));

            // Manually deselect item.
            TransactionListView.SelectedItem = null;
        }

        async void Add_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushModalAsync(new NavigationPage(new NewTransactionPage()));
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (viewModel.Transactions.Count == 0)
                viewModel.LoadItemsCommand.Execute(null);
        }
    }
}