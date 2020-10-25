using Microsoft.EntityFrameworkCore;
using MyMoney.Infrastructure.Entities;
using System;
using System.Linq;

namespace MyMoney.Infrastructure.EntityFramework
{
   public static class DatabaseSeeder
   {
      public static void Setup(DatabaseContext context)
      {
         context.Database.EnsureCreated();
         context.Database.Migrate();
      }

      public static void Seed(DatabaseContext context)
      {
         var budgets = context.Set<Budget>().AsEnumerable();

         foreach (var budget in budgets)
         {
            var monthId = budget.MonthId;

            var monthStr = monthId.Substring(4, 2);
            var yearStr = monthId.Substring(0, 4);

            var month = int.Parse(monthStr);
            var year = int.Parse(yearStr);

            budget.Month = month;
            budget.Year = year;

            Console.WriteLine($"MonthId:{monthId} -> Year:{year} Month:{month}");
         }

         context.SaveChanges();
      }
   }
}
