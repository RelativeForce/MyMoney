using Microsoft.EntityFrameworkCore;
using Budget = MyMoney.Infrastructure.Entities.Budget;
using Transaction = MyMoney.Infrastructure.Entities.Transaction;

namespace MyMoney.Infrastructure.EntityFramework
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Budget>();
            modelBuilder.Entity<Transaction>();
        }

        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<Budget> Budgets { get; set; }
    }
}
