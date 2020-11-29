using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IBudget : IBaseEntity
   {
      int Year { get; set; }
      int Month { get; set; }
      decimal Amount { get; set; }
      string Name { get; set; }
      string Notes { get; set; }
      long UserId { get; set; }

      IUser User { get; set; }
      IQueryable<ITransaction> Transactions { get; }
      void AddTransaction(IRelationRepository _relationRepository, ITransaction transaction);
      void RemoveTransaction(IRelationRepository relationRepository, ITransaction transaction);
      void RemoveAllTransactions(IRelationRepository relationRepository);
   }
}
