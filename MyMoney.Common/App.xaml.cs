using MyMoney.Client;
using MyMoney.Client.Interfaces;
using MyMoney.Common.Services;
using MyMoney.Common.Views;
using Xamarin.Forms;

namespace MyMoney.Common
{
    public partial class App : Application
    {
        public static readonly IAuthenticationManager AuthenticationManager = new AuthenticationManager();
        public static IMyMoneyClient NewApiClient => ClientFactory.NewClient(AuthenticationManager);

        private static readonly IMyMoneyClientFactory ClientFactory = new MyMoneyClientFactory();

        public App()
        {
            InitializeComponent();

            #region RegisterServices

            DependencyService.Register<MockDataStore>();

            #endregion

            MainPage = new MainPage();
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
    }
}
