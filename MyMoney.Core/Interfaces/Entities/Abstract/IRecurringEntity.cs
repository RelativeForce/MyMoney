using MyMoney.Core.Data;
using System;
using System.Collections.Generic;

namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IRecurringEntity<T> : IBaseEntity where T : IBaseEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
      public Period Recurrence { get; set; }
      public IList<T> BuildVirtualInstances();
   }
}
