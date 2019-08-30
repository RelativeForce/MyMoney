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

                        var newBudget = await client.BudgetApi.Add(budget);

                        await App.RootPage.DisplayAlert("Add Budget Success", $"Budget {newBudget.Id}", "Close");
                    }
                    catch (Exception ex)
                    {
                        await App.RootPage.DisplayAlert("Add Budget Failed", "Server Error", "Close");
                    }
                }
            });
        }
    }
}