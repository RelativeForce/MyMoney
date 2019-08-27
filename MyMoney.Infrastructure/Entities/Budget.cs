﻿using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Interfaces.Entites;

namespace MyMoney.Infrastructure.Entities
{
    public class Budget : BaseEntity, IBudget
    {
        public decimal Amount { get; set; }
        public DateTime Month { get; set; }
        public long UserId { get; set; }

        [NotMapped]
        public IUser User
        {
            get => UserProxy;
            set => UserProxy = value as User;
        }

        [ForeignKey("UserId")]
        public virtual User UserProxy { get; set; }

        internal static void Configure(ModelBuilder model)
        {
            model.Entity<Budget>().HasIndex(t => new {t.UserId, t.Month}).IsUnique();
            model.Entity<Budget>().HasOne(t => t.UserProxy).WithMany(t => t.BudgetsProxy).IsRequired();
        }
    }
}
