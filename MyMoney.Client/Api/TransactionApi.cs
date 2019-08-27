using System.Net.Http;
using System.Threading.Tasks;
using MyMoney.Client.Interfaces.Api;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;

namespace MyMoney.Client.Api
{
    public class TransactionApi : BaseApi, ITransactionApi
    {
        public TransactionApi(HttpClient client) : base(client)
        {
        }

        public async Task<TransactionListResponse> List(TransactionListRequest listParameters)
        {
            if (listParameters == null)
                return null;

            return await SendGet<TransactionListResponse>($"api/Transaction/List", listParameters);
        }

        public async Task<TransactionModel> Add(TransactionModel model)
        {
            if (model == null)
                return null;

            return await SendPost<TransactionModel>($"api/Transaction/Add", model);
        }
    }
}
