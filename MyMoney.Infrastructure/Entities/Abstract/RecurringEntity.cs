using System;
using MyMoney.Core.Interfaces.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities.Abstract
{
   public abstract class RecurringEntity<T> : BaseEntity, IRecurringEntity<T> where T : BaseEntity
   {
      public DateTime Start { get; set; }
      public DateTime End { get; set; }
   }
}
