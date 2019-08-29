using System;
using System.Net.Http;
using System.Threading.Tasks;
using MyMoney.Client.Interfaces;
using MyMoney.Client.Interfaces.Api;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;

namespace MyMoney.Client.Api
{
    public sealed class UserApi : BaseApi, IUserApi
    {
        public UserApi(HttpClient client, IAuthenticationManager manager) : base(client, manager)
        {

        }

        public async Task<bool> Authenticate()
        {
            if(Manager.CurrentUser == null)
                throw new InvalidOperationException("User must be logged in first");

            var response = await SendPost<LoginResponse>($"api/User/Login", Manager.CurrentUser.ToLoginRequest());

            if (!response.Success)
            {
                Manager.SetAuthenticated();
                return false;
            }

            Manager.SetAuthenticated(response.Token);
            return true;
        }

        public async Task<LoginResponse> Login(LoginRequest loginDetails)
        {
            if (loginDetails == null)
                return null;

            Manager.SaveUser(loginDetails.Email, loginDetails.Password);

            var response = await SendPost<LoginResponse>($"api/User/Login", loginDetails);

            if(!response.Success)
                return response;

            Manager.SetAuthenticated(response.Token);
            
            return response;
        }

        public async Task<LoginResponse> Register(RegisterRequest registerDetails)
        {
            if (registerDetails == null)
                return null;

            Manager.SaveUser(registerDetails.Email, registerDetails.Password);

            var response = await SendPost<LoginResponse>($"api/User/Register", registerDetails);

            if (!response.Success)
                return response;

            Manager.SetAuthenticated(response.Token);

            return response;
        }
    }
}
