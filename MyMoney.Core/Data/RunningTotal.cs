using MyMoney.Core.Interfaces.Entities;
using System;

namespace MyMoney.Core.Data
{
   public class RunningTotal
   {
      public long Id { get; }
      public string Link { get; }
      public string Name { get; }
      public string Text { get; }
      public DateTime Date { get; }
      public decimal Delta { get; }
      public decimal Value { get; private set; }

      public RunningTotal(ITransaction transaction)
      {
         
         if (transaction.Parent != null)
         {
            Link = $@"\transactions\edit-recurring\{transaction.Parent.Id}";
            Id = transaction.Parent.Id;
            Name = $"Recurring Transaction {transaction.Id}";
         }
         else {
            Link = $@"\transactions\edit\{transaction.Id}";
            Id = transaction.Id;
            Name = $"Transaction {transaction.Id}";
         }

         Text = transaction.Description;
         Date = transaction.Date;
         Delta = -transaction.Amount;
      }

      public RunningTotal(IIncome income)
      {
         Id = income.Id;
         Link = $@"\incomes\edit\{income.Id}";
         Name = $"Income {income.Id}";
         Text = income.Name;
         Date = income.Date;
         Delta = income.Amount;
      }

      public decimal AdjustTotal(decimal runningTotal)
      {
         Value = runningTotal + Delta;
         return Value;
      }
   }
}
