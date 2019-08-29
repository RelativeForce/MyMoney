using System.Threading.Tasks;
using MyMoney.Client.Models.Common;
using MyMoney.Client.Models.Entity;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;

namespace MyMoney.Client.Interfaces.Api
{
    public interface ITransactionApi
    {
        Task<TransactionListResponse> List(DateRangeModel listParameters);
        Task<TransactionModel> Add(TransactionModel model);
        Task<UpdateResponse> Update(TransactionModel model);
        Task<DeleteResponse> Delete(DeleteRequest deleteRequest);
    }
}
