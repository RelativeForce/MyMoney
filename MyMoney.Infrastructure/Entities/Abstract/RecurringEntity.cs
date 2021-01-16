using System;
using System.Collections.Generic;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class RecurringEntity<T> : UserFilteredEntity, IUserFilteredEntity, IRecurringEntity<T> where T : IUserFilteredEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
      public Frequency Recurrence { get; set; }
      public abstract IList<T> VirtualChildren();
   }
}
