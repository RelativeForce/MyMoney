using System.Threading.Tasks;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;

namespace MyMoney.Client.Interfaces.Api
{
    public interface IBudgetApi
    {
        Task<BudgetModel> Add(BudgetModel model);
        Task<BudgetModel> Find(BudgetRequest findParameters);
    }
}
