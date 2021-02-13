using MyMoney.Core.Interfaces.Entities.Abstract;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IBudget : IUserFilteredEntity
   {
      int Year { get; set; }
      int Month { get; set; }
      decimal Amount { get; set; }
      string Name { get; set; }
      string Notes { get; set; }
      IQueryable<ITransaction> Transactions { get; }
   }
}
