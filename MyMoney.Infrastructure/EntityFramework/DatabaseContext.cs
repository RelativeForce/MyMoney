﻿using Microsoft.EntityFrameworkCore;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Infrastructure.EntityFramework
{
   public class DatabaseContext : DbContext
   {
      public DatabaseContext(DbContextOptions options) : base(options) { }

      protected override void OnModelCreating(ModelBuilder modelBuilder)
      {
         Budget.Configure(modelBuilder);
         Transaction.Configure(modelBuilder);
         Income.Configure(modelBuilder);
         User.Configure(modelBuilder);
         TransactionBudget.Configure(modelBuilder);
         TransactionIncome.Configure(modelBuilder);
         RecurringTransaction.Configure(modelBuilder);
         RecurringIncome.Configure(modelBuilder);
      }

      public virtual DbSet<Transaction> Transactions { get; set; }
      public virtual DbSet<Budget> Budgets { get; set; }
      public virtual DbSet<User> Users { get; set; }
      public virtual DbSet<Income> Incomes { get; set; }
      public virtual DbSet<RecurringTransaction> RecurringTransactions { get; set; }
      public virtual DbSet<RecurringIncome> RecurringIncomes { get; set; }
   }
}
