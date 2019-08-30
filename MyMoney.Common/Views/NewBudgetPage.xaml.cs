using System;
using System.ComponentModel;
using MyMoney.Client.Models.Entity;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class NewBudgetPage : ContentPage
    {
        public BudgetModel Budget { get; set; }
        public string MaxDate { get; set; }
        public string MinDate { get; set; }

        public NewBudgetPage()
        {
            InitializeComponent();

            Budget = new BudgetModel
            {
                Amount = 0,
                Notes = "",
                Start = DateTime.Now,
                End = DateTime.Now.AddDays(7)
            };

            MaxDate = DateTime.Now.AddMonths(36).ToShortDateString();
            MinDate = DateTime.Now.AddMonths(-36).ToShortDateString();

            BindingContext = this;
        }

        public async void Save_Clicked(object sender, EventArgs e)
        {
            MessagingCenter.Send(this, "AddBudget", Budget);
            await Navigation.PopModalAsync();
        }

        public async void OnStartDateChanged(object sender, DateChangedEventArgs args)
        {
            if (args.NewDate > Budget.End)
            {
                Budget.Start = args.OldDate;
                StartDatePicker.Date = args.OldDate;
                await App.RootPage.DisplayAlert("Invalid Date", "Start must be before End", "Close");
                return;
            }

            Budget.Start = args.NewDate;
        }

        public async void OnEndDateChanged(object sender, DateChangedEventArgs args)
        {
            if (args.NewDate < Budget.Start)
            {
                Budget.End = args.OldDate;
                EndDatePicker.Date = args.OldDate;
                await App.RootPage.DisplayAlert("Invalid Date", "End must be after Start", "Close");
                return;
            }

            Budget.End = args.NewDate;
        }

        public async void Cancel_Clicked(object sender, EventArgs e)
        {
            await Navigation.PopModalAsync();
        }
    }
}