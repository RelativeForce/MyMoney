using System.Net.Http;
using System.Threading.Tasks;
using MyMoney.Client.Interfaces.Api;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;

namespace MyMoney.Client.Api
{
    public sealed class UserApi : BaseApi, IUserApi
    {
        public UserApi(HttpClient client) : base(client)
        {

        }

        public async Task<LoginResponse> Login(LoginRequest loginDetails)
        {
            if (loginDetails == null)
                return null;

            return await SendPost<LoginResponse>($"api/User/Login", loginDetails);
        }

        public async Task<LoginResponse> Register(RegisterRequest registerDetails)
        {
            if (registerDetails == null)
                return null;

            return await SendPost<LoginResponse>($"api/User/Register", registerDetails);
        }
    }
}
