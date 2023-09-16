using System;
using System.Collections.Generic;
using MyMoney.Core.Data;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IRecurringEntity<TChild> : IUserFilteredEntity where TChild : IRecurringChildEntity
   {
      DateTime Start { get; set; }
      DateTime End { get; set; }
      Frequency Recurrence { get; set; }
      List<TChild> Children(Func<TChild, bool> filter = null);
   }
}
