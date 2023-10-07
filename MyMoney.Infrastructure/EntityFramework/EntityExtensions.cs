using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Infrastructure.EntityFramework;

public static class EntityExtensions
{
    public static IQueryable<RecurringTransaction> IncludeChildren(this IQueryable<RecurringTransaction> queryable)
    {
        return queryable
            .Include(rt => rt.RealChildren)
            .ThenInclude(t => t.IncomesProxy)
            .ThenInclude(i => i.Income)
            .Include(rt => rt.RealChildren)
            .ThenInclude(t => t.BudgetsProxy)
            .ThenInclude(b => b.Budget);
    }
    
    public static IQueryable<RecurringIncome> IncludeChildren(this IQueryable<RecurringIncome> queryable)
    {
        return queryable
            .Include(ri => ri.RealChildren)
            .ThenInclude(i => i.TransactionsProxy)
            .ThenInclude(t => t.Transaction);
    }
    
    public static IQueryable<Income> IncludeTransactions(this IQueryable<Income> queryable)
    {
        return queryable
            .Include(i => i.TransactionsProxy)
            .ThenInclude(t => t.Transaction);
    }
    
    public static IQueryable<Transaction> IncludeBudgets(this IQueryable<Transaction> queryable)
    {
        return queryable
            .Include(t => t.BudgetsProxy)
            .ThenInclude(p => p.Budget);
    }
    
    public static IQueryable<Transaction> IncludeIncomes(this IQueryable<Transaction> queryable)
    {
        return queryable
            .Include(t => t.IncomesProxy)
            .ThenInclude(p => p.Income);
    }
    
    public static IQueryable<Transaction> IncludeParent(this IQueryable<Transaction> queryable)
    {
        return queryable.Include(t => t.Parent);
    }
    
    public static IQueryable<Budget> IncludeTransactions(this IQueryable<Budget> queryable)
    {
        return queryable
            .Include(b => b.TransactionsProxy)
            .ThenInclude(p => p.Transaction);
    }
}