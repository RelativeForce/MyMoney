using System.Net.Http;
using System.Threading.Tasks;
using MyMoney.Client.Interfaces;
using MyMoney.Client.Interfaces.Api;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;

namespace MyMoney.Client.Api
{
    public class TransactionApi : BaseApi, ITransactionApi
    {
        public TransactionApi(HttpClient client, IAuthenticationManager manager) : base(client, manager)
        {
        }

        public async Task<TransactionListResponse> List(DateRangeModel listParameters)
        {
            if (listParameters == null)
                return null;

            EnsureAuthenticated();

            return await SendPost<TransactionListResponse>($"api/Transaction/List", listParameters);
        }

        public async Task<TransactionModel> Add(TransactionModel model)
        {
            if (model == null)
                return null;

            EnsureAuthenticated();

            return await SendPost<TransactionModel>($"api/Transaction/Add", model);
        }

        public async Task<DeleteResponse> Delete(DeleteRequest deleteRequest)
        {
            if (deleteRequest == null)
                return null;

            EnsureAuthenticated();

            return await SendPost<DeleteResponse>($"api/Transaction/Delete", deleteRequest);
        }
    }
}
