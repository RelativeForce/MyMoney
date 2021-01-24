using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class RecurringEntity<T> : UserFilteredEntity, IUserFilteredEntity, IRecurringEntity<T> where T : class, IRecurringChildEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
      public Frequency Recurrence { get; set; }

      public IList<T> Children(IRepository repository, Expression<Func<T, bool>> filter = null)
      {
         // Use an empty filter if none is specified
         filter ??= (t) => true;

         var virtualChildren = Recurrence
            .Repeat(Start, End, BuildVirtualChild)
            .Cast<T>()
            .Where(filter.Compile())
            .ToDictionary(t => t.Date);

         var realChildren = repository
            .UserFiltered<T>(UserId)
            .Where(t => t.ParentId == Id)
            .Where(filter)
            .ToList();

         // Replace virtual children with the real ones
         foreach (var realTransaction in realChildren)
            virtualChildren[realTransaction.Date] = realTransaction;

         return virtualChildren
            .Values
            .OrderBy(t => t.Date)
            .ToList();
      }
      protected abstract T BuildVirtualChild(DateTime date);
   }
}
