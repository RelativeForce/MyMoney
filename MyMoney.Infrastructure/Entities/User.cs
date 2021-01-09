using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Infrastructure.Entities.Abstract;

namespace MyMoney.Infrastructure.Entities
{
   public class User : BaseEntity, IUser
   {
      [Required]
      public string Email { get; set; }
      [Required]
      public string Password { get; set; }
      public DateTime DateOfBirth { get; set; }
      [Required]
      public string FullName { get; set; }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<User>().HasIndex(t => new { t.Email }).IsUnique();
      }

      public IEnumerable<string> ValidationErrors()
      {
         if (!IsValidEmail(Email))
            yield return "Invalid Email";

         if (string.IsNullOrWhiteSpace(FullName))
            yield return "Invalid Full Name";

         if (DateOfBirth >= DateTime.Today)
            yield return "Invalid Date of Birth";
      }

      private static bool IsValidEmail(string emailAddress)
      {
         try
         {
            new MailAddress(emailAddress);
            return true;
         }
         catch (FormatException)
         {
            return false;
         }
      }
   }
}
