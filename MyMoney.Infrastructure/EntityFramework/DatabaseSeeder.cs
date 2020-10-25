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
      }
   }
}
