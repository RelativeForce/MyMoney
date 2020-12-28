using MyMoney.Core;
using System;

namespace MyMoney.Infrastructure.EntityFramework
{
   public static class DatabaseConstants
   {
      public const string LocalDatabaseConnection = @"Server=.\SQLEXPRESS;Initial Catalog=MyMoney;Trusted_Connection=True;MultipleActiveResultSets=true;Integrated Security=True";

      public static string DatabaseConnection => Environment.GetEnvironmentVariable(EnvironmentVariables.DatabaseConnection) ?? LocalDatabaseConnection;

      public static DatabaseEngine TargetDatabaseEngine
      {
         get
         {
            var engine = Environment.GetEnvironmentVariable(EnvironmentVariables.DatabaseEngine) ?? string.Empty;

            if (engine.ToUpper() == "MYSQL")
               return DatabaseEngine.MySQL;

            if (engine.ToUpper() == "SQLSERVER")
               return DatabaseEngine.SQLServer;

            Console.WriteLine($"'{EnvironmentVariables.DatabaseEngine}' environment variable is not assigned, defaulting to {nameof(DatabaseEngine.SQLServer)}");
            return DatabaseEngine.SQLServer;
         }
      }

      public enum DatabaseEngine
      {
         SQLServer,
         MySQL
      }
   }
}
