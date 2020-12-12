using MyMoney.Core.Services;
using System;

namespace MyMoney.Web.Models.Entity
{
   public class RunningTotalDto : EntityDto
   {
      public bool IsTransaction { get; }
      public bool IsIncome { get; }
      public string Text { get; }
      public string Date { get; }
      public decimal Delta { get; }
      public decimal Value { get; private set; }

      public RunningTotalDto(RunningTotal runningTotal): base(runningTotal.Id)
      {
         IsTransaction = runningTotal.IsTransaction;
         IsIncome = runningTotal.IsIncome;
         Text = runningTotal.Text;
         Date = runningTotal.Date.ToShortDateString();
         Delta = runningTotal.Delta;
         Value = runningTotal.Value;
      }
   }
}
