﻿using System;

namespace MyMoney.Web.Models.Request
{
   public class RegisterDto
   {
      public string Email { get; set; }
      public string Password { get; set; }
      public DateTime DateOfBirth { get; set; }
      public string FullName { get; set; }
   }
}
