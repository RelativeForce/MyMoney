using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces
{
   public interface IEntityFactory
   {
      IBudget NewBudget { get; }
      ITransaction NewTransaction { get; }
      IUser NewUser { get; }
      IIncome NewIncome { get; }
      IRecurringTransaction NewRecurringTransaction { get; }
      IRecurringIncome NewRecurringIncome { get; }
   }
}
