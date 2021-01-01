using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces
{
   public interface ITokenProvider
   {
      Token NewToken(IUser user);
   }
}
