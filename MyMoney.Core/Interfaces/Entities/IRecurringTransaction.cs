using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IRecurringTransaction : IUserFilteredEntity, IRecurringEntity<ITransaction>
   {
      string Description { get; set; }
      string Notes { get; set; }
      decimal Amount { get; set; }
   }
}
