using MyMoney.Core.Interfaces.Entites;

namespace MyMoney.Infrastructure.Entities
{
    public abstract class BaseEntity : IBaseEntity
    {
        public long Id { get; set; }
    }
}
