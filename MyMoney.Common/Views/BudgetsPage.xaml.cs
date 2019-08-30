using System;
using System.ComponentModel;
using MyMoney.Common.ViewModels;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class BudgetsPage : ContentPage
    {
        private BudgetsViewModel viewModel;

        public BudgetsPage()
        {
            InitializeComponent();

            BindingContext = viewModel = new BudgetsViewModel();
        }

        public async void Add_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushModalAsync(new NavigationPage(new NewBudgetPage()));
        }
    }
}