using System.ComponentModel.DataAnnotations.Schema;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class UserFilteredEntity : BaseEntity, IUserFilteredEntity
   {
      public long UserId { get; set; }

      [ForeignKey(nameof(UserId))]
      public virtual User User { get; set; }
   }
}
