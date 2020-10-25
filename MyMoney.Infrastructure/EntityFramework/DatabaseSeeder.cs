namespace MyMoney.Infrastructure.EntityFramework
{
   public sealed class DatabaseSeeder
   {
      public void EnsureCreated(DatabaseContext context)
      {
         context.Database.EnsureCreated();
      }

      public void Seed(DatabaseContext context)
      {

      }
   }
}
