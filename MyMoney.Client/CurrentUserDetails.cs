using MyMoney.Client.Interfaces;
using MyMoney.Client.Models.Request;

namespace MyMoney.Client
{
    public sealed class CurrentUserDetails : ICurrentUserDetails
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public LoginRequest ToLoginRequest()
        {
            return new LoginRequest{
                Email = Email,
                Password = Password
            };
        }
    }
}
