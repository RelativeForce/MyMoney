using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IRecurringIncome : IRecurringEntity<IIncome>
   {
      string Name { get; set; }
      decimal Amount { get; set; }
      string Notes { get; set; }
   }
}
