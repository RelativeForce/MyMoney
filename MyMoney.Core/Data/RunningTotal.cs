using MyMoney.Core.Interfaces.Entities;
using System;

namespace MyMoney.Core.Data
{
   public class RunningTotal
   {
      public long Id { get; }
      public bool IsTransaction { get; }
      public bool IsIncome { get; }
      public string Text { get; }
      public DateTime Date { get; }
      public decimal Delta { get; }
      public decimal Value { get; private set; }

      public RunningTotal(ITransaction transaction)
      {
         Id = transaction.Id;
         IsIncome = false;
         IsTransaction = true;
         Text = transaction.Description;
         Date = transaction.Date;
         Delta = -transaction.Amount;
      }

      public RunningTotal(IIncome income)
      {
         Id = income.Id;
         IsTransaction = false;
         IsIncome = true;
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
