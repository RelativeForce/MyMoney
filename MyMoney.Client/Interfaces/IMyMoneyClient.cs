using System;
using MyMoney.Client.Interfaces.Api;

namespace MyMoney.Client.Interfaces
{
    public interface IMyMoneyClient : IDisposable
    {
        IUserApi UserApi { get; }
        IBudgetApi BudgetApi { get; }
        ITransactionApi TransactionApi { get; }
        void SetToken(string token);
    }
}
