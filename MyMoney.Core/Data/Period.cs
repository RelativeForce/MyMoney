using System;
using System.Collections.Generic;

namespace MyMoney.Core.Data
{
   public enum Period
   {
      Day = 0,
      Week = 1,
      Month = 2,
      Year = 3,
   }

   public static class PeriodExtensions
   {
      public static DateTime AddPeriod(this DateTime date, Period period)
      {
         return period switch
         {
            Period.Day => date.AddDays(1),
            Period.Week => date.AddDays(7),
            Period.Month => date.AddMonths(1),
            Period.Year => date.AddYears(1),
            _ => throw new ArgumentException($"Invalid value '{period}' for {nameof(Period)}"),
         };
      }

      public static int CountBetween(this Period period, DateTime start, DateTime end)
      {
         var current = start;
         var count = 0;
         while (current <= end)
         {
            current = current.AddPeriod(period);
            count++;
         }
         return count;
      }

      public static IList<T> Repeat<T>(this Period period, DateTime start, DateTime end, Func<DateTime, T> instanceBuilder)
      {
         var instances = new List<T>();
         var current = start;
         while (current <= end)
         {
            instances.Add(instanceBuilder(current));
            current = current.AddPeriod(period);
         }
         return instances;
      }
   }
}