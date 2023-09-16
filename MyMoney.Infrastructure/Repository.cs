using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.EntityFramework;

namespace MyMoney.Infrastructure
{
   public sealed class Repository : IRepository
   {
      private readonly DatabaseContext _model;

      public Repository(DatabaseContext model)
      {
         _model = model;
      }

      public void Dispose()
      {
         _model.Dispose();
      }

      public T Add<T>(T newItem) where T : class, IBaseEntity
      {
         if (newItem == null)
            return null;

         try
         {
            _model.Add(newItem);
            _model.SaveChanges();

            return newItem;
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return null;
         }

      }

      public bool Delete<T>(T item) where T : class, IBaseEntity
      {
         if (item == null)
            return false;

         try
         {
            _model.Remove(item);
            _model.SaveChanges();

            return true;
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return false;
         }
      }

      public bool DeleteRange<T>(IEnumerable<T> items) where T : class, IBaseEntity
      {
         if (items == null)
            return false;

         try
         {
            _model.RemoveRange(items);
            _model.SaveChanges();

            return true;
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return false;
         }
      }

      public bool Update<T>(T item) where T : class, IBaseEntity
      {
         if (item == null)
            return false;

         // TODO: Check validity of item

         try
         {
            _model.SaveChanges();

            return true;
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return false;
         }
      }

      public bool UpdateRange<T>(IEnumerable<T> items) where T : class, IBaseEntity
      {
         if (items == null)
            return false;

         // TODO: Check validity of item

         try
         {
            _model.SaveChanges();

            return true;
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return false;
         }
      }

      public IQueryable<T> UserFiltered<T>(long userId) where T : class, IUserFilteredEntity
      {
         return All<T>().Where(e => e.UserId == userId);
      }

      public IQueryable<T> All<T>() where T : class, IBaseEntity
      {
         try
         {
            return _model.Set<T>();
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return null;
         }
      }
   }
}
