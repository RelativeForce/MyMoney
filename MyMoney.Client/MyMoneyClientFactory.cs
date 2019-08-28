using MyMoney.Client.Interfaces;

namespace MyMoney.Client
{
    public class MyMoneyClientFactory : IMyMoneyClientFactory
    {
        public IMyMoneyClient NewClient(string token = null)
        {
            return new MyMoneyClient(token);
        }
    }
}
