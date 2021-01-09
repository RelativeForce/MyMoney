using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using System.Linq;

namespace MyMoney.Web.Models.Entity
{
   public class TransactionDto : EntityDto
   {
      public string Date { get; set; }
      public string Description { get; set; }
      public string Notes { get; set; }
      public decimal Amount { get; set; }
      public long[] BudgetIds { get; set; }
      public long[] IncomeIds { get; set; }
      public long? RecurringTransactionId { get; set; }
      public Frequency? RecurringFrequency { get; set; }

      public TransactionDto()
      {

      }

      public TransactionDto(ITransaction model) : base(model.Id)
      {
         Date = model.Date.ToShortDateString();
         Description = model.Description;
         Notes = model.Notes;
         Amount = model.Amount;
         RecurringFrequency = model.Parent?.Recurrence;
         RecurringTransactionId = model.Parent?.Id;
         BudgetIds = model.Budgets.Select(t => t.Id).ToArray();
         IncomeIds = model.Incomes.Select(t => t.Id).ToArray();
      }
   }
}
