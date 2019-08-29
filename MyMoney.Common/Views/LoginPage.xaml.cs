using System;
using System.ComponentModel;
using System.Diagnostics;
using MyMoney.Client;
using MyMoney.Client.Interfaces;
using MyMoney.Common.Models;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class LoginPage : ContentPage
    {
        public ICurrentUserDetails UserDetails { get; set; }

        public LoginPage()
        {
            InitializeComponent();

            UserDetails = new CurrentUserDetails
            {
                Email = "",
                Password = ""
            };

            IsBusy = false;

            BindingContext = this;
        }

        async void Login_Clicked(object sender, EventArgs e)
        {
            IsBusy = true;

            using (var client = App.NewApiClient())
            {
                try
                {
                    var response = await client.UserApi.Login(UserDetails.ToLoginRequest());

                    if (response.Success)
                    {
                        App.Login();
                    }
                    else
                    {
                        await App.RootPage.DisplayAlert("Login Failed", response.Error, "Close");
                    }
                }
                catch (Exception ex)
                {
                    await App.RootPage.DisplayAlert("Login Failed", "Server Error", "Close");
                }
            }

            IsBusy = false;
        }

        async void Register_Clicked(object sender, EventArgs e)
        {
            
        }
    }
}