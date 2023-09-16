namespace MyMoney.Core.Interfaces.Entities
{
   public interface IUserFilteredEntity : IBaseEntity
   {
      long UserId { get; set; }
   }
}
