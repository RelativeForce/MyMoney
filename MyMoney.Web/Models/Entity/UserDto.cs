using MyMoney.Core.Interfaces.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMoney.Web.Models.Entity
{
   public class UserDto
   {
      public string Email { get; set; }
      public string DateOfBirth { get; set; }
      public string FullName { get; set; }

      public UserDto(IUser user)
      {
         Email = user.Email;
         DateOfBirth = user.DateOfBirth.ToShortDateString();
         FullName = user.FullName;
      }
   }
}
