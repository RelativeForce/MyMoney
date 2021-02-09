using System;

namespace MyMoney.Core.Interfaces.Entities.Abstract
{
   public interface IRecurringChildEntity : IUserFilteredEntity
   {
      DateTime Date { get; set; }
      long? ParentId { get; set; }
   }
}
