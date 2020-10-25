using System;
using System.Linq;
using System.Linq.Expressions;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces
{
   public interface IRepository : IDisposable
   {
      T Add<T>(T newItem) where T : class, IBaseEntity;
      bool Delete<T>(T item) where T : class, IBaseEntity;
      bool Update<T>(T item) where T : class, IBaseEntity;
      IQueryable<T> Where<T>(Expression<Func<T, bool>> predicate) where T : class, IBaseEntity;
      T Find<T>(Func<T, bool> predicate) where T : class, IBaseEntity;
      T FindById<T>(long id) where T : class, IBaseEntity;
      IQueryable<T> All<T>() where T : class, IBaseEntity;
   }
}
