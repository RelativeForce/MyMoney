using MyMoney.Client.Interfaces;

namespace MyMoney.Client
{
    public sealed class AuthenticationManager : IAuthenticationManager
    {
        public ICurrentUserDetails CurrentUser { get; private set; }
        public bool IsAuthenticated => Token != null;
        public string Token { get; set; }

        public AuthenticationManager()
        {
            CurrentUser = null;
            SetAuthenticated();
        }

        public void SetUser(string email, string password)
        {
            CurrentUser = new CurrentUserDetails
            {
                Email = email,
                Password = password
            };
        }

        public void SetAuthenticated(string token)
        {
            Token = token;
        }

        public void SetAuthenticated()
        {
            Token = null;
        }
    }
}
