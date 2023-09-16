using System;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IRecurringChildEntity : IUserFilteredEntity
   {
      DateTime Date { get; set; }
      long? ParentId { get; set; }
   }
}
