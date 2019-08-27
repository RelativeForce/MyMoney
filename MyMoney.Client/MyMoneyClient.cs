using System.Net.Http;
using MyMoney.Client.Api;
using MyMoney.Client.Interfaces;
using MyMoney.Client.Interfaces.Api;

namespace MyMoney.Client
{
    public sealed class MyMoneyClient : IMyMoneyClient
    {
        private readonly HttpClient _client;

        public MyMoneyClient(string token = null)
        {
            _client = new HttpClient();

            UserApi = new UserApi(_client);
            BudgetApi = new BudgetApi(_client);
            TransactionApi = new TransactionApi(_client);

            SetToken(token);
        }

        public IUserApi UserApi { get; private set; }
        public IBudgetApi BudgetApi { get; private set; }
        public ITransactionApi TransactionApi { get; private set; }

        public void SetToken(string token)
        {
            UserApi.Token = token;
            TransactionApi.Token = token;
            BudgetApi.Token = token;
        }

        public void Dispose()
        {
            UserApi = null;
            BudgetApi = null;
            TransactionApi = null;

            _client.Dispose();
        }
    }
}
