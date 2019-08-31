using System.Threading.Tasks;
using MyMoney.Client;
using MyMoney.Client.Interfaces;
using MyMoney.Common.Data;
using MyMoney.Common.Views;
using Xamarin.Forms;

namespace MyMoney.Common
{
    public partial class App : Application, IAlertDisplay
    {
        public static MainPage RootPage => Current.MainPage as MainPage;
        public static DataStore DataStore { get; private set; }

        public static readonly IAuthenticationManager AuthenticationManager = new AuthenticationManager();

        public App()
        {
            InitializeComponent();

            DataStore = new DataStore(new MyMoneyClientFactory(), AuthenticationManager, this);
            MainPage = new MainPage();
        }

        public static void Login()
        {
            RootPage.Detail = new NavigationPage(new TransactionListPage());
            (RootPage.Master as MenuPage)?.PopulateMenuItems();
        }

        public static void LogOut()
        {
            AuthenticationManager.ClearUser();
            RootPage.Detail = new NavigationPage(new LoginPage());
            (RootPage.Master as MenuPage)?.PopulateMenuItems();
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }

        public async Task DisplayAlert(string title, string message, string cancel)
        {
            await RootPage.DisplayAlert(title, message, cancel);
        }

        public async Task DisplayAlert(string title, string message, string accept, string cancel)
        {
            await RootPage.DisplayAlert(title, message, accept, cancel);
        }
    }
}
