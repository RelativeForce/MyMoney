using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IRecurringTransaction<T> : IRecurringEntity<T> where T : ITransaction
   {
      string Description { get; set; }
      string Notes { get; set; }
      decimal Amount { get; set; }
      long UserId { get; set; }

      IUser User { get; set; }
   }
}
