using System;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities.Abstract;
using MyMoney.Infrastructure.EntityFramework;

namespace MyMoney.Infrastructure
{
   public sealed class RelationRepository : IRelationRepository
   {
      private readonly DatabaseContext _model;

      public RelationRepository(DatabaseContext model)
      {
         _model = model;
      }

      public void Dispose()
      {
         _model.Dispose();
      }

      public T Add<T>(T newItem) where T : class, IRelationEntity
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

      public bool Delete<T>(T item) where T : class, IRelationEntity
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
   }
}
