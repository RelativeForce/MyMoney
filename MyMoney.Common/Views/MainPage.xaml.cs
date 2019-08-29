using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Net.Security;
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
        public Dictionary<int, NavigationPage> MenuPages = new Dictionary<int, NavigationPage>();

        public MainPage()
        {
            InitializeComponent();

            MasterBehavior = MasterBehavior.Popover;
        }

        public async Task NavigateFromMenu(int id)
        {
            var item = (HomeMenuItems) id;

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