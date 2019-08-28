using MyMoney.Client.Models.Request;

namespace MyMoney.Client.Interfaces
{
    public interface ICurrentUserDetails
    {
        string Email { get; set; }
        string Password { get; set; }

        LoginRequest ToLoginRequest();
    }
}