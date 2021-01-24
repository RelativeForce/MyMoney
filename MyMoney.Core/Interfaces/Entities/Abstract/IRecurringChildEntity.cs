using System;

namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IRecurringChildEntity : IUserFilteredEntity
   {
      public DateTime Date { get; set; }
      public long? ParentId { get; set; }
   }
}
