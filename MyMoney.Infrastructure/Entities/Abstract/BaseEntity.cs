using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class BaseEntity : IBaseEntity
   {
      public long Id { get; set; }
   }
}
