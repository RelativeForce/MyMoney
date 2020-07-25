using Microsoft.EntityFrameworkCore;
using MyMoney.Infrastructure.Entities;
using Budget = MyMoney.Infrastructure.Entities.Budget;
using Transaction = MyMoney.Infrastructure.Entities.Transaction;

namespace MyMoney.Infrastructure.EntityFramework
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Budget.Configure(modelBuilder);
            Transaction.Configure(modelBuilder);
            User.Configure(modelBuilder);
            TransactionBudget.Configure(modelBuilder);
        }

        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<Budget> Budgets { get; set; }
        public virtual DbSet<User> Users { get; set; }
    }
}
