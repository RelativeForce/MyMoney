using MyMoney.Core.Interfaces.Entities;
using System;

namespace MyMoney.Core.Interfaces
{
   public interface ITokenProvider
   {
      DateTime TokenTimeOut { get; }

      string NewToken(IUser user);
   }
}
