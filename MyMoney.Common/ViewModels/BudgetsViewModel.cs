using System;
using MyMoney.Client.Models.Entity;
using MyMoney.Common.Views;
using Xamarin.Forms;

namespace MyMoney.Common.ViewModels
{
    public class BudgetsViewModel : BaseViewModel
    {
        public BudgetsViewModel()
        {
            Title = "Budgets";

            SetupMessages();
        }

        public void SetupMessages()
        {
            MessagingCenter.Subscribe<NewBudgetPage, BudgetModel>(this, "AddBudget", async (obj, budget) =>
            {
                await App.DataStore.AddBudget(budget);
            });
        }
    }
}