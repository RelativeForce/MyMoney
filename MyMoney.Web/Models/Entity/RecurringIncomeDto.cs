using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Web.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;

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

      public RecurringIncomeDto(IRecurringIncome model, IList<IIncome> children) : this(model)
      {
         Children = children.Select(t => new RecurringEntityChildDto(t)).ToList();
      }

      public RecurringIncomeDto(IRecurringIncome model) : base(model.Id)
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
