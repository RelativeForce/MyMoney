using MyMoney.Core.Interfaces.Entities;
using MyMoney.Web.Models.Entity;

namespace MyMoney.Web.Models.Response
{
   public class RecurringEntityChildDto : EntityDto
   {
      public string Date { get; set; }

      public RecurringEntityChildDto() : base()
      { 
         // Required for deserialization
      }

      public RecurringEntityChildDto(IRecurringChildEntity model) : base(model.Id)
      {
         Date = model.Date.ToShortDateString();
      }
   }
}
