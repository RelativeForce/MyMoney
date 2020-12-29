using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces
{
   public interface ICurrentUserProvider
   {
      long CurrentUserId { get; }
      IUser CurrentUser { get; }
   }
}
