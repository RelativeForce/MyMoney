using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces
{
   public interface IRepository : IDisposable
   {
      T Add<T>(T newItem) where T : class, IBaseEntity;
      bool Delete<T>(T item) where T : class, IBaseEntity;
      bool DeleteRange<T>(IEnumerable<T> items) where T : class, IBaseEntity;
      bool Update<T>(T item) where T : class, IBaseEntity;
      bool UpdateRange<T>(IEnumerable<T> items) where T : class, IBaseEntity;
      IQueryable<T> All<T>() where T : class, IBaseEntity;
      IQueryable<T> UserFiltered<T>(long userId) where T : class, IUserFilteredEntity;
   }
}
