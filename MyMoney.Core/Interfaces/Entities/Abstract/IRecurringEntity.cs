using System;

namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IRecurringEntity<T> : IBaseEntity where T : IBaseEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
   }
}
