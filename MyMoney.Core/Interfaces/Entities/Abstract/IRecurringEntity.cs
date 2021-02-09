using MyMoney.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IRecurringEntity<TChild> : IUserFilteredEntity where TChild : IRecurringChildEntity
   {
      DateTime Start { get; set; }
      DateTime End { get; set; }
      Frequency Recurrence { get; set; }
      IList<TChild> Children(IRepository repository, Expression<Func<TChild, bool>> filter = null);
   }
}
