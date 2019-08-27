using MyMoney.Core.Interfaces.Entites;

namespace MyMoney.Core.Interfaces
{
    public interface IEntityFactory
    {
        IBudget NewBudget { get; }
        ITransaction NewTransaction { get; }
    }
}
