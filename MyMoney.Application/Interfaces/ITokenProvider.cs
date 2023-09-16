using MyMoney.Core.Data;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces
{
   public interface ITokenProvider
   {
      Token NewToken(User user);
   }
}
