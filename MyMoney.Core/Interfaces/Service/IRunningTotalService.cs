using MyMoney.Core.Data;
using System;
using System.Collections.Generic;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IRunningTotalService
   {
      IList<RunningTotal> RunningTotal(decimal initialTotal, DateTime start, DateTime end);
   }
}