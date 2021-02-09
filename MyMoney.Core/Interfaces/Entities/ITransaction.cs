using MyMoney.Core.Interfaces.Entities.Abstract;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface ITransaction : IRecurringChildEntity
   {
      string Description { get; set; }
      string Notes { get; set; }
      decimal Amount { get; set; }
      IRecurringTransaction Parent { get; set; }

      IQueryable<IBudget> Budgets { get; }
      IQueryable<IIncome> Incomes { get; }

      void UpdateIncomes(IRepository repository, IRelationRepository relationRepository, long[] incomeIds);
      void UpdateBudgets(IRepository repository, IRelationRepository relationRepository, long[] budgetIds);
      void DeleteAllBudgets(IRelationRepository relationRepository);
      void DeleteAllIncomes(IRelationRepository relationRepository);
   }
}