using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core
{
   public interface ICurrentUserProvider
   {
      long CurrentUserId { get; }
      IUser CurrentUser { get; }
   }
}
