using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entites;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Infrastructure
{
    public sealed class EntityFactory : IEntityFactory
    {
        public IBudget NewBudget => new Budget();
        public ITransaction NewTransaction => new Transaction();
    }
}
