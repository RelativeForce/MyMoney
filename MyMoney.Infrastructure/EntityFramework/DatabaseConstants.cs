using System;

namespace MyMoney.Infrastructure.EntityFramework
{
   public static class DatabaseConstants
   {
      public const string DevelopmentDatabaseConnection = @"Server=.\SQLEXPRESS;Initial Catalog=MyMoney;Trusted_Connection=True;MultipleActiveResultSets=true;Integrated Security=True";

      public static string DatabaseConnection => Environment.GetEnvironmentVariable("MyMoney_Database_Connection") ?? DevelopmentDatabaseConnection;
   }
}
