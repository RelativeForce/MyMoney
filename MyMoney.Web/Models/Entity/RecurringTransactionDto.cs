using MyMoney.Core.Data;
using MyMoney.Web.Models.Response;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Web.Models.Entity
{
   public class RecurringTransactionDto : EntityDto
   {
      public string Start { get; set; }
      public string End { get; set; }
      public Frequency Recurrence { get; set; }
      public string Description { get; set; }
      public string Notes { get; set; }
      public decimal Amount { get; set; }
      public List<RecurringEntityChildDto> Children { get; set; }

      public RecurringTransactionDto()
      {

      }

      public RecurringTransactionDto(RecurringTransaction model, List<Transaction> children) : this(model)
      {
         Children = children.Select(t => new RecurringEntityChildDto(t)).ToList();
      }

      public RecurringTransactionDto(RecurringTransaction model) : base(model.Id)
      {
         Start = model.Start.ToShortDateString();
         End = model.End.ToShortDateString();
         Children = new List<RecurringEntityChildDto>();
         Description = model.Description;
         Notes = model.Notes;
         Amount = model.Amount;
         Recurrence = model.Recurrence;
      }
   }
}
