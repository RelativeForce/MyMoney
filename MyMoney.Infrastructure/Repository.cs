using System;
using System.Linq;
using System.Linq.Expressions;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Entities.Abstract;
using MyMoney.Infrastructure.Entities;
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

      public bool Update<T>(T item) where T : class, IBaseEntity
      {
         if (item == null)
            return false;

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

      public IQueryable<T> Where<T>(Expression<Func<T, bool>> predicate) where T : class, IBaseEntity
      {
         if (predicate == null)
            return null;

         try
         {
            return Set<T>().Where(predicate);
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return null;
         }
      }

      public T Find<T>(Func<T, bool> predicate) where T : class, IBaseEntity
      {
         if (predicate == null)
            return null;

         try
         {
            return Set<T>().FirstOrDefault(predicate);
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return null;
         }
      }

      public T FindById<T>(long id) where T : class, IBaseEntity
      {
         if (id <= 0)
            return null;

         try
         {
            return Set<T>().FirstOrDefault(e => e.Id == id);
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return null;
         }
      }

      public IQueryable<T> All<T>() where T : class, IBaseEntity
      {
         try
         {
            return Set<T>();
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return null;
         }
      }

      public IQueryable<T> UserFiltered<T>(long userId) where T : class, IUserFilteredEntity { 
         try
         {
            return Set<T>().Where(e => e.UserId == userId);
         }
         catch (Exception e)
         {
            Console.WriteLine(e);
            return null;
         }
      }

      public IQueryable<T> UserFiltered<T>(IUser user) where T : class, IUserFilteredEntity
      {
         return UserFiltered<T>(user.Id);
      }

      private IQueryable<T> Set<T>() where T : class, IBaseEntity
      {
         if (typeof(T) == typeof(ITransaction))
            return _model.Set<Transaction>().Cast<ITransaction>().AsQueryable() as IQueryable<T>;

         if (typeof(T) == typeof(IUser))
            return _model.Set<User>().Cast<IUser>().AsQueryable() as IQueryable<T>;

         if (typeof(T) == typeof(IBudget))
            return _model.Set<Budget>().Cast<IBudget>().AsQueryable() as IQueryable<T>;

         if (typeof(T) == typeof(IIncome))
            return _model.Set<Income>().Cast<IIncome>().AsQueryable() as IQueryable<T>;

         if (typeof(T) == typeof(IRecurringTransaction))
            return _model.Set<RecurringTransaction>().Cast<IRecurringTransaction>().AsQueryable() as IQueryable<T>;

         // Attempt to use entity directly
         return _model.Set<T>().AsQueryable();
      }
   }
}
