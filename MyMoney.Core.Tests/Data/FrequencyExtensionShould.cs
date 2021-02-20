using System;
using MyMoney.Core.Data;
using Xunit;

namespace MyMoney.Core.Tests.Services
{
   public class FrequencyExtensionShould
   {
      #region Add Tests

      [Fact]
      public void ShouldAddDayPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddDays(1), now.Add(Frequency.Day));
      }

      [Fact]
      public void ShouldAddWeekPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddDays(7), now.Add(Frequency.Week));
      }

      [Fact]
      public void ShouldAddFortnightPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddDays(14), now.Add(Frequency.Fortnight));
      }

      [Fact]
      public void ShouldAddFourWeekPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddDays(28), now.Add(Frequency.FourWeek));
      }

      [Fact]
      public void ShouldAddMonthPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddMonths(1), now.Add(Frequency.Month));
      }

      [Fact]
      public void ShouldAddYearPeriodToDate()
      {
         var now = DateTime.Now;
         Assert.Equal(now.AddYears(1), now.Add(Frequency.Year));
      }

      #endregion

      #region CountBetween Tests

      #region Day

      [Fact]
      public void ShouldCountDaysInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");
         Assert.Equal(365, Frequency.Day.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountDaysInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("28/02/2019");
         Assert.Equal(59, Frequency.Day.CountBetween(startJanuary2019, endFebuary2019));
      }

      [Fact]
      public void ShouldCountDaysInMonthWhenLeapYear()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2020");
         var endFebuary2019 = DateTime.Parse("29/02/2020");
         Assert.Equal(60, Frequency.Day.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion Day

      #region Week

      [Fact]
      public void ShouldCountWeeksInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole weeks
         Assert.Equal(53, Frequency.Week.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountWeeksInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("31/01/2019");

         // Note: Not whole weeks
         Assert.Equal(5, Frequency.Week.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion Week

      #region Fortnight

      [Fact]
      public void ShouldCountFortnightsInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole fortnights
         Assert.Equal(27, Frequency.Fortnight.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountFortnightsInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("31/01/2019");

         // Note: Not whole fortnights
         Assert.Equal(3, Frequency.Fortnight.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion Fortnight

      #region FourWeek

      [Fact]
      public void ShouldCountFourWeekInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole four week periods
         Assert.Equal(14, Frequency.FourWeek.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountFourWeekInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("31/01/2019");

         // Note: Not whole four week periods
         Assert.Equal(2, Frequency.FourWeek.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion FourWeek

      #region Month

      [Fact]
      public void ShouldCountMonthsStartsInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole weeks
         Assert.Equal(12, Frequency.Month.CountBetween(start2019, end2019));
      }

      [Fact]
      public void ShouldCountMonthStartsInMonth()
      {
         var startJanuary2019 = DateTime.Parse("01/01/2019");
         var endFebuary2019 = DateTime.Parse("31/01/2019");

         // Note: Not whole weeks
         Assert.Equal(1, Frequency.Month.CountBetween(startJanuary2019, endFebuary2019));
      }

      #endregion Month

      #region Year

      [Fact]
      public void ShouldCountYearStartsInYear()
      {
         var start2019 = DateTime.Parse("01/01/2019");
         var end2019 = DateTime.Parse("31/12/2019");

         // Note: Not whole weeks
         Assert.Equal(1, Frequency.Year.CountBetween(start2019, end2019));
      }

      #endregion Year

      #endregion CountBetween Tests
   }
}
