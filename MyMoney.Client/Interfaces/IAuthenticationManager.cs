namespace MyMoney.Client.Interfaces
{
    public interface IAuthenticationManager
    {
        ICurrentUserDetails CurrentUser { get; }
        string Token { get; set; }
        bool IsAuthenticated { get; }
        void SetAuthenticated(string token);
        void SetUser(string email, string password);
        void SetAuthenticated();
    }
}