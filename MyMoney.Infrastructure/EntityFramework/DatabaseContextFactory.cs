using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MyMoney.Infrastructure.EntityFramework
{
   public class DatabaseContextFactory : IDesignTimeDbContextFactory<DatabaseContext>
   {
      public DatabaseContext CreateDbContext(string[] args)
      {
         var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
         optionsBuilder.UseSqlServer(@"Server=.\SQLEXPRESS;Initial Catalog=MyMoney;Trusted_Connection=True;MultipleActiveResultSets=true;Integrated Security=True");

         return new DatabaseContext(optionsBuilder.Options);
      }
   }
}
