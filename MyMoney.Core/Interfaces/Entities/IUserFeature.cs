using MyMoney.Core.Data;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IUserFeature
   {
      long UserId { get; set; }
      IUser User { get; set; }
      FeatureFlags Feature { get; set; }
   }
}
