using System;
using System.Linq;
using System.Linq.Expressions;
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
                return _model.Set<T>().Where(predicate);
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
                return _model.Set<T>().FirstOrDefault(predicate);
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
                return _model.Set<T>().FirstOrDefault(e => e.Id == id);
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
