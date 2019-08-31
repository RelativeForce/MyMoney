using System;
using System.ComponentModel;
using System.Threading.Tasks;
using MyMoney.Common.Models;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class MainPage : MasterDetailPage
    {
        public MainPage()
        {
            InitializeComponent();

            MasterBehavior = MasterBehavior.Popover;
        }

        public async Task NavigateFromMenu(HomeMenuItems item)
        {
            switch (item)
            {
                case HomeMenuItems.Transactions:
                    await NavigateTo(new TransactionListPage());
                    break;
                case HomeMenuItems.About:
                    await NavigateTo(new AboutPage());
                    break;
                case HomeMenuItems.Login:
                    await NavigateTo(new LoginPage());
                    break;
                case HomeMenuItems.Register:
                    await NavigateTo(new RegisterPage());
                    break;
                case HomeMenuItems.Budget:
                    await NavigateTo(new BudgetsPage());
                    break;
                case HomeMenuItems.Logout:
                    App.LogOut();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private async Task NavigateTo(Page newPage)
        {
            if (newPage != null && Detail != newPage)
            {
                Detail = new NavigationPage(newPage);

                if (Device.RuntimePlatform == Device.Android)
                    await Task.Delay(100);

                IsPresented = false;
            }
        }
    }
}