namespace MyMoney.Client.Interfaces
{
    public interface IMyMoneyClientFactory
    {
        IMyMoneyClient NewClient(string token = null);
    }
}
