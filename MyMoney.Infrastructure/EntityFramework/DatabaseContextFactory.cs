using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MyMoney.Infrastructure.EntityFramework
{
   public class DatabaseContextFactory : IDesignTimeDbContextFactory<DatabaseContext>
   {
      public DatabaseContext CreateDbContext(string[] args)
      {
         var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
         optionsBuilder.UseSqlServer(DatabaseConstants.DatabaseConnection);

         return new DatabaseContext(optionsBuilder.Options);
      }
   }
}
