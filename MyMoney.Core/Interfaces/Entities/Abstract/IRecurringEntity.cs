using MyMoney.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IRecurringEntity<TChild> : IBaseEntity where TChild : IRecurringChildEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
      public Frequency Recurrence { get; set; }
      public IList<TChild> Children(IRepository repository, Expression<Func<TChild, bool>> filter = null);
   }
}
