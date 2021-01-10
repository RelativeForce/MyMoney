using System;
using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Core.Interfaces
{
   public interface IRelationRepository : IDisposable
   {
      T Add<T>(T newItem) where T : class, IRelationEntity;
      bool Delete<T>(T item) where T : class, IRelationEntity;
   }
}
