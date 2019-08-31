using System;
using System.ComponentModel;
using MyMoney.Client;
using MyMoney.Client.Interfaces;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class LoginPage : ContentPage
    {
        public ICurrentUserDetails UserDetails { get; set; }

        public bool IsFormEnabled { get; set; }

        public LoginPage()
        {
            InitializeComponent();

            UserDetails = new CurrentUserDetails
            {
                Email = "",
                Password = ""
            };
            
            IsBusy = false;
            IsFormEnabled = true;

            BindingContext = this;
        }

        async void Login_Clicked(object sender, EventArgs e)
        {
            IsBusy = true;
            IsFormEnabled = false;

            await App.DataStore.Login(UserDetails.ToLoginRequest());

            IsBusy = false;
            IsFormEnabled = true;
        }

        void Register_Clicked(object sender, EventArgs e)
        {
            App.RootPage.Detail = new NavigationPage(new RegisterPage());
        }
    }
}