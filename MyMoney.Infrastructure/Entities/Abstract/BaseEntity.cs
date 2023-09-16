using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class BaseEntity : IBaseEntity
   {
      public long Id { get; set; }
   }
}
