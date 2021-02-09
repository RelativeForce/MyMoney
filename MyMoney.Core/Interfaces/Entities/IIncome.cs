using MyMoney.Core.Interfaces.Entities.Abstract;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IIncome : IRecurringChildEntity
   {
      string Name { get; set; }
      decimal Amount { get; set; }
      string Notes { get; set; }
      IRecurringIncome Parent { get; set; }

      IQueryable<ITransaction> Transactions { get; }
      void DeleteAllTransactions(IRelationRepository relationRepository);
   }
}
