using MyMoney.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IRecurringEntity<T> : IBaseEntity where T : IBaseEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
      public Frequency Recurrence { get; set; }
      public IList<T> Children(IRepository repository, Expression<Func<T, bool>> filter = null);
   }
}
