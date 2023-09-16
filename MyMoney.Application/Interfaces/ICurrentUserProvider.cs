using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces
{
   public interface ICurrentUserProvider
   {
      long CurrentUserId { get; }
      User CurrentUser { get; }
   }
}
