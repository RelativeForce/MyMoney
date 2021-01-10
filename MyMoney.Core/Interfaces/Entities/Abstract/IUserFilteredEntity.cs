namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IUserFilteredEntity : IBaseEntity
   {
      long UserId { get; set; }
      IUser User { get; set; }
   }
}
