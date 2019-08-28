using MyMoney.Client.Interfaces;

namespace MyMoney.Client
{
    public sealed class MyMoneyClientFactory : IMyMoneyClientFactory
    {
        public IMyMoneyClient NewClient(IAuthenticationManager manager)
        {
            return new MyMoneyClient(manager);
        }
    }
}
