using Microsoft.EntityFrameworkCore;

namespace MyMoney.Infrastructure.EntityFramework
{
   public static class DatabaseSeeder
   {
      public static void Setup(DatabaseContext context)
      {
         // Will create database if not present
         context.Database.Migrate();
      }

      public static void Seed(DatabaseContext context)
      {
      }
   }
}
