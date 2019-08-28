using System.Net.Http;
using MyMoney.Client.Api;
using MyMoney.Client.Interfaces;
using MyMoney.Client.Interfaces.Api;

namespace MyMoney.Client
{
    public sealed class MyMoneyClient : IMyMoneyClient
    {
        private readonly IAuthenticationManager _manager;
        private readonly HttpClient _client;

        public IUserApi UserApi { get; private set; }
        public IBudgetApi BudgetApi { get; private set; }
        public ITransactionApi TransactionApi { get; private set; }

        public MyMoneyClient(IAuthenticationManager manager) : this(manager, new HttpClient())
        {
        }

        public MyMoneyClient(IAuthenticationManager manager, HttpClient client)
        {
            _manager = manager;
            _client = client;

            UserApi = new UserApi(_client, manager);
            BudgetApi = new BudgetApi(_client, manager);
            TransactionApi = new TransactionApi(_client, manager);
        }

        public void Dispose()
        {
            UserApi = null;
            BudgetApi = null;
            TransactionApi = null;

            _manager.SetAuthenticated();
            _client.Dispose();
        }
    }
}
