using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using System;
using System.Linq;

namespace MyMoney.Web.Models.Entity
{
   public class RecurringTransactionDto : EntityDto
   {
      public string Start { get; set; }
      public string End { get; set; }
      public Period Recurrence { get; set; }
      public string Description { get; set; }
      public string Notes { get; set; }
      public decimal Amount { get; set; }
      public string[] Dates { get; set; }

      public RecurringTransactionDto()
      {

      }

      public RecurringTransactionDto(IRecurringTransaction model) : base(model.Id)
      {
         Start = model.Start.ToShortDateString();
         End = model.End.ToShortDateString();
         Dates = model.Recurrence.Repeat(model.Start, model.End, (DateTime date) => date.ToShortDateString()).ToArray();
         Description = model.Description;
         Notes = model.Notes;
         Amount = model.Amount;
         Recurrence = model.Recurrence;
      }
   }
}
