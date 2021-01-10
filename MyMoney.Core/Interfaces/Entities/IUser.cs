using MyMoney.Core.Interfaces.Entities.Abstract;
using System;
using System.Collections.Generic;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IUser : IBaseEntity
   {
      string Email { get; set; }
      string Password { get; set; }
      DateTime DateOfBirth { get; set; }
      string FullName { get; set; }

      IEnumerable<string> ValidationErrors();
   }
}
