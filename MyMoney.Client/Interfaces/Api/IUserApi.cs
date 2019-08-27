using System.Threading.Tasks;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;

namespace MyMoney.Client.Interfaces.Api
{
    public interface IUserApi : IBaseApi
    {
        Task<LoginResponse> Login(LoginRequest loginDetails);
        Task<LoginResponse> Register(RegisterRequest registerDetails);
    }
}
