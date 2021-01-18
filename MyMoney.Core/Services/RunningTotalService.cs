using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Service;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MyMoney.Core.Services
{
   public class RunningTotalService : IRunningTotalService
   {
      private readonly ITransactionService _transactionService;
      private readonly IIncomeService _incomeService;

      public RunningTotalService(ITransactionService transactionService, IIncomeService incomeService)
      {
         _transactionService = transactionService;
         _incomeService = incomeService;
      }

      public IList<RunningTotal> RunningTotal(decimal initialTotal, DateTime start, DateTime end)
      {
         var transactions = _transactionService
            .Between(start, end)
            .Select(t => new RunningTotal(t));

         var incomes = _incomeService
            .Between(start, end)
            .Select(i => new RunningTotal(i));

         var runningTotals = transactions
            .Concat(incomes)
            .OrderBy(rt => rt.Date)
            .ToList();

         foreach (var rt in runningTotals)
         {
            initialTotal = rt.AdjustTotal(initialTotal);
         }

         return runningTotals;
      }
   }
}
