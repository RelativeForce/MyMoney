using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MyMoney.Infrastructure.Entities
{
    public class TransactionBudget
    {
        [Required]
        public long TransactionId { get; set; }
        public virtual Transaction Transaction { get; set; }

        [Required]
        public long BudgetId { get; set; }
        public virtual Budget Budget { get; set; }

        public TransactionBudget()
        {
            // Required by EF
        }

        public TransactionBudget(Transaction transaction, Budget budget)
        {
            Transaction = transaction;
            TransactionId = transaction.Id;
            Budget = budget;
            BudgetId = budget.Id;
        }

        internal static void Configure(ModelBuilder model)
        {
            model.Entity<TransactionBudget>().HasKey(t => new { t.BudgetId, t.TransactionId });
            model.Entity<TransactionBudget>().HasOne(t => t.Transaction).WithMany(t => t.BudgetsProxy).OnDelete(DeleteBehavior.Cascade);
            model.Entity<TransactionBudget>().HasOne(t => t.Budget).WithMany(t => t.TransactionsProxy).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
