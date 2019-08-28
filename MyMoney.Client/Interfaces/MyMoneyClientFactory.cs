namespace MyMoney.Client.Interfaces
{
    public interface IMyMoneyClientFactory
    {
        IMyMoneyClient NewClient(IAuthenticationManager manager);
    }
}
