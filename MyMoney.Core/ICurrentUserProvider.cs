using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core
{
    public interface ICurrentUserProvider
    {
        long CurrentUserId(string token);
        IUser CurrentUser(string token);
    }
}
