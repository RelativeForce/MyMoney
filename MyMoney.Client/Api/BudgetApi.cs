using System.Net.Http;
using System.Threading.Tasks;
using MyMoney.Client.Interfaces.Api;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;

namespace MyMoney.Client.Api
{
    public sealed class BudgetApi : BaseApi, IBudgetApi
    {
        public BudgetApi(HttpClient client) : base(client)
        {

        }

        public async Task<BudgetModel> Add(BudgetModel model)
        {
            if (model == null)
                return null;

            return await SendPost<BudgetModel>($"api/Budget/Add", model);
        }

        public async Task<BudgetModel> Find(BudgetRequest findParameters)
        {
            if (findParameters == null)
                return null;

            return await SendGet<BudgetModel>($"api/Budget/Find", findParameters);
        }
    }
}
