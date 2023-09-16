using MyMoney.Core.Data;
using System.Linq;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Web.Models.Entity
{
   public class IncomeDto : EntityDto
   {
      public string Date { get; set; }
      public string Name { get; set; }
      public string Notes { get; set; }
      public decimal Amount { get; set; }
      public decimal Remaining { get; set; }
      public long? ParentId { get; set; }
      public Frequency? ParentFrequency { get; set; }

      public IncomeDto()
      {

      }

      public IncomeDto(Income model) : base(model.Id)
      {
         Date = model.Date.ToShortDateString();
         Name = model.Name;
         Notes = model.Notes;
         Amount = model.Amount;
         Remaining = model.Amount - model.Transactions.Select(t => t.Amount).Sum();
         ParentFrequency = model.Parent?.Recurrence;
         ParentId = model.Parent?.Id;
      }
   }
}
