using System;
using System.Collections.Generic;
using System.Linq;
using MyMoney.Application.Interfaces.Services;

namespace MyMoney.Application.Services
{
   public class RunningTotalService : IRunningTotalService
   {
      private readonly IBasicTransactionService _basicTransactionService;
      private readonly IRecurringTransactionService _recurringTransactionService;
      private readonly IBasicIncomeService _basicIncomeService;
      private readonly IRecurringIncomeService _recurringIncomeService;

      public RunningTotalService(IBasicTransactionService basicTransactionService, IRecurringTransactionService recurringTransactionService, IBasicIncomeService basicIncomeService, IRecurringIncomeService recurringIncomeService)
      {
         _basicTransactionService = basicTransactionService;
         _recurringTransactionService = recurringTransactionService;
         _basicIncomeService = basicIncomeService;
         _recurringIncomeService = recurringIncomeService;
      }

      public IList<RunningTotal> RunningTotal(decimal initialTotal, DateTime start, DateTime end)
      {
         var basicTransactions = _basicTransactionService
            .Between(start, end)
            .Select(t => new RunningTotal(t));

         var recurringTransactions = _recurringTransactionService
            .Between(start, end)
            .Select(t => new RunningTotal(t));

         var basicIncomes = _basicIncomeService
            .Between(start, end)
            .Select(i => new RunningTotal(i));

         var recurringIncomes = _recurringIncomeService
            .Between(start, end)
            .Select(i => new RunningTotal(i));

         var runningTotals = basicTransactions
            .Concat(recurringTransactions)
            .Concat(basicIncomes)
            .Concat(recurringIncomes)
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
