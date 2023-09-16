using MyMoney.Core.Interfaces.Entities;
using MyMoney.Web.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMoney.Web.Models.Response
{
   public class RecurringEntityChildDto : EntityDto
   {
      public string Date { get; set; }

      public RecurringEntityChildDto() : base()
      { 
         // Required for deserialisation
      }

      public RecurringEntityChildDto(IRecurringChildEntity model) : base(model.Id)
      {
         Date = model.Date.ToShortDateString();
      }
   }
}
