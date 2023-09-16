using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class RecurringEntity<T> : UserFilteredEntity, IRecurringEntity<T> where T : class, IRecurringChildEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
      public Frequency Recurrence { get; set; }
      public virtual ICollection<T> RealChildren { get; set; } = new List<T>();

      public List<T> Children(Func<T, bool> filter = null)
      {
         // Use an empty filter if none is specified
         filter ??= _ => true;

         var virtualChildren = Recurrence
            .Repeat(Start, End, BuildVirtualChild)
            .Where(filter)
            .ToDictionary(t => t.Date);

         var realChildren = RealChildren
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
