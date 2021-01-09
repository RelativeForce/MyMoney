using MyMoney.Core.Interfaces.Entities.Abstract;
using System;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IIncome : IUserFilteredEntity
   {
      DateTime Date { get; set; }
      string Name { get; set; }
      decimal Amount { get; set; }

      IQueryable<ITransaction> Transactions { get; }
      void AddTransaction(IRelationRepository _relationRepository, ITransaction transaction);
      void RemoveTransaction(IRelationRepository relationRepository, ITransaction transaction);
      void RemoveAllTransactions(IRelationRepository relationRepository);
   }
}
