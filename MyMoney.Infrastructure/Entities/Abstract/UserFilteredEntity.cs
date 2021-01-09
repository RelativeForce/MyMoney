using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class UserFilteredEntity : BaseEntity, IUserFilteredEntity
   {
      public long UserId { get; set; }

      [NotMapped]
      public IUser User
      {
         get => UserProxy;
         set => UserProxy = value as User;
      }

      [ForeignKey(nameof(UserId))]
      public virtual User UserProxy { get; set; }
   }
}
