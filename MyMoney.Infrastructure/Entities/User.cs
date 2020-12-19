using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;

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

      [NotMapped]
      public IQueryable<IBudget> Budgets => BudgetsProxy.Cast<IBudget>().AsQueryable();
      public virtual ICollection<Budget> BudgetsProxy { get; set; } = new List<Budget>();

      [NotMapped]
      public IQueryable<IIncome> Incomes => IncomesProxy.Cast<IIncome>().AsQueryable();
      public virtual ICollection<Income> IncomesProxy { get; set; } = new List<Income>();

      [NotMapped]
      public IQueryable<ITransaction> Transactions => TransactionsProxy.Cast<ITransaction>().AsQueryable();
      public virtual ICollection<Transaction> TransactionsProxy { get; set; } = new List<Transaction>();

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
