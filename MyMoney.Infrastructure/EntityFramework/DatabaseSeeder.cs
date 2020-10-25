using Microsoft.EntityFrameworkCore;

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
