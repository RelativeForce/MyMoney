using System;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application
{
   public class RunningTotal
   {
      public long Id { get; }
      public long? ParentId { get; }
      public string Name { get; }
      public string Text { get; }
      public DateTime Date { get; }
      public decimal Delta { get; }
      public decimal Value { get; private set; }

      public RunningTotal(Transaction transaction)
      {
         Name = $"Transaction {transaction.Id}";
         Id = transaction.Id;
         Text = transaction.Description;
         Date = transaction.Date;
         Delta = -transaction.Amount;
         ParentId = transaction.ParentId;
      }

      public RunningTotal(Income income)
      {
         Id = income.Id;
         Name = $"Income {income.Id}";
         Text = income.Name;
         Date = income.Date;
         Delta = income.Amount;
         ParentId = income.ParentId;
      }

      public decimal AdjustTotal(decimal runningTotal)
      {
         Value = runningTotal + Delta;
         return Value;
      }
   }
}
