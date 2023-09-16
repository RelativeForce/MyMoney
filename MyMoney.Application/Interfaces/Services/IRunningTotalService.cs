using System;
using System.Collections.Generic;

namespace MyMoney.Application.Interfaces.Services
{
   public interface IRunningTotalService
   {
      IList<RunningTotal> RunningTotal(decimal initialTotal, DateTime start, DateTime end);
   }
}