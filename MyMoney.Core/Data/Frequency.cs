using System;
using System.Collections.Generic;

namespace MyMoney.Core.Data
{
   public enum Frequency
   {
      Day = 0,
      Week = 1,
      Month = 2,
      Year = 3,
      Fortnight = 4,
      FourWeek = 5,
   }

   public static class FrequencyExtensions
   {
      private const int DaysInWeek = 7;

      public static DateTime Add(this DateTime date, Frequency period)
      {
         return period switch
         {
            Frequency.Day => date.AddDays(1),
            Frequency.Week => date.AddDays(DaysInWeek),
            Frequency.Fortnight => date.AddDays(2 * DaysInWeek),
            Frequency.FourWeek => date.AddDays(4 * DaysInWeek),
            Frequency.Month => date.AddMonths(1),
            Frequency.Year => date.AddYears(1),
            _ => throw new ArgumentException($"Invalid value '{period}' for {nameof(Frequency)}"),
         };
      }

      public static int CountBetween(this Frequency period, DateTime start, DateTime end)
      {
         var current = start;
         var count = 0;
         while (current <= end)
         {
            current = current.Add(period);
            count++;
         }
         return count;
      }

      public static List<T> Repeat<T>(this Frequency period, DateTime start, DateTime end, Func<DateTime, T> instanceBuilder)
      {
         var instances = new List<T>();
         var current = start;
         while (current <= end)
         {
            instances.Add(instanceBuilder(current));
            current = current.Add(period);
         }
         return instances;
      }
   }
}