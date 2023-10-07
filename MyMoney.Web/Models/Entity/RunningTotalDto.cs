using MyMoney.Application;

namespace MyMoney.Web.Models.Entity
{
   public class RunningTotalDto : EntityDto
   {
      public long? ParentId { get; }
      public string Text { get; }
      public string Name { get; }
      public string Date { get; }
      public decimal Delta { get; }
      public decimal Value { get; private set; }

      public RunningTotalDto(RunningTotal runningTotal): base(runningTotal.Id)
      {
         Text = runningTotal.Text;
         Date = runningTotal.Date.ToShortDateString();
         Delta = runningTotal.Delta;
         Value = runningTotal.Value;
         ParentId = runningTotal.ParentId;
         Name = runningTotal.Name;
      }
   }
}
