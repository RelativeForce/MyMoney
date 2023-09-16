using MyMoney.Core.Data;
using MyMoney.Web.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Web.Models.Entity
{
   public class RecurringIncomeDto : EntityDto
   {
      public string Start { get; set; }
      public string End { get; set; }
      public Frequency Recurrence { get; set; }
      public string Name { get; set; }
      public string Notes { get; set; }
      public decimal Amount { get; set; }
      public IList<RecurringEntityChildDto> Children { get; set; }

      public RecurringIncomeDto()
      {

      }

      public RecurringIncomeDto(RecurringIncome model, IList<Income> children) : this(model)
      {
         Children = children.Select(t => new RecurringEntityChildDto(t)).ToList();
      }

      public RecurringIncomeDto(RecurringIncome model) : base(model.Id)
      {
         Start = model.Start.ToShortDateString();
         End = model.End.ToShortDateString();
         Children = new List<RecurringEntityChildDto>();
         Name = model.Name;
         Notes = model.Notes;
         Amount = model.Amount;
         Recurrence = model.Recurrence;
      }
   }
}
