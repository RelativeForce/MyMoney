using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities
{
    public class Budget : BaseEntity, IBudget
    {
        public decimal Amount { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Notes { get; set; }
        public long UserId { get; set; }

        [NotMapped]
        public IUser User
        {
            get => UserProxy;
            set => UserProxy = value as User;
        }

        [ForeignKey(nameof(UserId))]
        public virtual User UserProxy { get; set; }

        internal static void Configure(ModelBuilder model)
        {
            model.Entity<Budget>().HasIndex(t => new {t.UserId, t.Start, t.End, t.Amount}).IsUnique();
            model.Entity<Budget>().HasOne(t => t.UserProxy).WithMany(t => t.BudgetsProxy).IsRequired();
        }
    }
}
