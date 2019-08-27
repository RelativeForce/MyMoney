using System.Threading.Tasks;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;

namespace MyMoney.Client.Interfaces.Api
{
    public interface ITransactionApi : IBaseApi
    {
        Task<TransactionListResponse> List(TransactionListRequest listParameters);
        Task<TransactionModel> Add(TransactionModel model);
    }
}
