﻿using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Service;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MyMoney.Core.Services
{
   public class RunningTotalService : IRunningTotalService
   {
      private readonly IBasicTransactionService _basicTransactionService;
      private readonly IRecurringTransactionService _recurringTransactionService;
      private readonly IIncomeService _incomeService;

      public RunningTotalService(IBasicTransactionService basicTransactionService, IRecurringTransactionService recurringTransactionService, IIncomeService incomeService)
      {
         _basicTransactionService = basicTransactionService;
         _recurringTransactionService = recurringTransactionService;
         _incomeService = incomeService;
      }

      public IList<RunningTotal> RunningTotal(decimal initialTotal, DateTime start, DateTime end)
      {
         var basicTransactions = _basicTransactionService
            .Between(start, end)
            .Select(t => new RunningTotal(t));

         var recurringTransactions = _recurringTransactionService
            .Between(start, end)
            .Select(t => new RunningTotal(t));

         var incomes = _incomeService
            .Between(start, end)
            .Select(i => new RunningTotal(i));

         var runningTotals = basicTransactions
            .Concat(recurringTransactions)
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
