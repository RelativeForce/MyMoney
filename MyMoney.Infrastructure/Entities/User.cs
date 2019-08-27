using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities
{
    public class User : BaseEntity, IUser
    { 
        [Required]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string FullName { get; set; }

        [NotMapped]
        public IQueryable<IBudget> Budgets => BudgetsProxy.Cast<IBudget>().AsQueryable();
        public ICollection<Budget> BudgetsProxy { get; set; } = new List<Budget>();

        [NotMapped]
        public IQueryable<ITransaction> Transactions => TransactionsProxy.Cast<ITransaction>().AsQueryable();
        public ICollection<Transaction> TransactionsProxy { get; set; } = new List<Transaction>();

        public IList<ITransaction> Between(DateTime start, DateTime end)
        {
            return TransactionsProxy
                .Where(t => DateTime.Compare(t.Date, start) >= 0 && DateTime.Compare(t.Date, end) <= 0)
                .Cast<ITransaction>()
                .ToList();
        }

        internal static void Configure(ModelBuilder model)
        {
            model.Entity<User>().HasIndex(t => new { t.Email }).IsUnique();
        }
    }
}
