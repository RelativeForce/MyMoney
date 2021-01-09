using System;
using MyMoney.Core.Data;
using Xunit;

namespace MyMoney.Core.Tests.Services
{
   public class PeriodExtensionShould
   {
      #region AddPeriod Tests

      [Fact]
      public void ShouldAddDayPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddDays(1), now.AddPeriod(Period.Day));
      }

      [Fact]
      public void ShouldAddWeekPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddDays(7), now.AddPeriod(Period.Week));
      }

      [Fact]
      public void ShouldAddMonthPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddMonths(1), now.AddPeriod(Period.Month));
      }

      [Fact]
      public void ShouldAddYearPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddYears(1), now.AddPeriod(Period.Year));
      }

      #endregion

      #region CountBetween Tests

      #region Day

      [Fact]
      public void ShouldCountDaysInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");
         Assert.Equal(365, Period.Day.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountDaysInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("28/02/2019");
         Assert.Equal(59, Period.Day.CountBetween(startJanuary2019, endFebuary2019));
      }

      [Fact]
      public void ShouldCountDaysInMonthWhenLeapYear()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2020");
         var endFebuary2019 = DateTime.Parse("29/02/2020");
         Assert.Equal(60, Period.Day.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion Day

      #region Week

      [Fact]
      public void ShouldCountWeeksInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole weeks
         Assert.Equal(53, Period.Week.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountWeeksInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("31/01/2019");

         // Note: Not whole weeks
         Assert.Equal(5, Period.Week.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion Week

      #region Month

      [Fact]
      public void ShouldCountMonthsStartsInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole weeks
         Assert.Equal(12, Period.Month.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountMonthStartsInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("31/01/2019");

         // Note: Not whole weeks
         Assert.Equal(1, Period.Month.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion Month

      #region Year

      [Fact]
      public void ShouldCountYearStartsInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole weeks
         Assert.Equal(1, Period.Year.CountBetween(start2019, end2019));
      }

      #endregion Year

      #endregion CountBetween Tests
   }
}
