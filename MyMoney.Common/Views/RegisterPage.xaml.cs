using System;
using System.ComponentModel;
using System.Threading.Tasks;
using MyMoney.Client.Models.Request;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class RegisterPage : ContentPage
    {
        public RegisterRequest UserDetails { get; set; }
        public string MaxDate { get; set; }
        public string MinDate { get; set; }
        public string RePassword { get; set; }

        public RegisterPage()
        {
            InitializeComponent();

            UserDetails = new RegisterRequest
            {
                Email = "",
                Password = "",
                DateOfBirth = DateTime.Today.AddYears(-10),
                FullName = ""
            };

            IsBusy = false;
            RePassword = "";
            MaxDate = DateTime.Today.ToShortDateString();
            MinDate = DateTime.Today.AddYears(-100).ToShortDateString();

            BindingContext = this;
        }

        public void OnDateChanged(object sender, DateChangedEventArgs args)
        {
            UserDetails.DateOfBirth = args.NewDate;
        }

        public async void Register_Clicked(object sender, EventArgs e)
        {
            if (!await IsValid())
            {
                return;
            }

            IsBusy = true;

            using (var client = App.NewApiClient())
            {
                try
                {
                    var response = await client.UserApi.Register(UserDetails);

                    if (response.Success)
                    {
                        App.Login();
                    }
                    else
                    {
                        await App.RootPage.DisplayAlert("Register Failed", response.Error, "Close");
                    }
                }
                catch (Exception ex)
                {
                    await App.RootPage.DisplayAlert("Register Failed", "Server Error", "Close");
                }
            }

            IsBusy = false;
        }

        public void Login_Clicked(object sender, EventArgs e)
        {
            App.RootPage.Detail = new NavigationPage(new LoginPage());
        }

        private async Task<bool> IsValid()
        {
            if (!RePassword.Equals(UserDetails.Password))
            {
                await App.RootPage.DisplayAlert("Register Failed", "Passwords do not match", "Close");
            }

            // Final clause is valid situation
            else
            {
                return true;
            }

            return false;
        }
    }
}