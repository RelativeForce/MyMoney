using MyMoney.Core.Services;

namespace MyMoney.Web.Models.Response
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Error { get; set; }
        public string Token { get; set; }
        public string ValidTo { get; set; }

        public LoginResponse(LoginResult result)
        {
            Success = result.Success;
            Error = result.Error;
            Token = result.Token;
            ValidTo = result.ValidTo.ToString("yyyy-MM-dd") + "T" + result.ValidTo.ToString("HH:mm:ss");
        }
    }
}
