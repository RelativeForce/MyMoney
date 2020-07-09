using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces
{
    public interface ITokenProvider
    {
        string NewToken(IUser user);

        long? GetUserId(string token);
    }
}
