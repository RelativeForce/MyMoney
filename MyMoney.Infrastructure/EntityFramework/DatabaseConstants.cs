using System;

namespace MyMoney.Infrastructure.EntityFramework
{
   public static class DatabaseConstants
   {
      public const string LocalDatabaseConnection = @"Server=.\SQLEXPRESS;Initial Catalog=MyMoney;Trusted_Connection=True;MultipleActiveResultSets=true;Integrated Security=True";

      public static string DatabaseConnection => Environment.GetEnvironmentVariable(DatabaseConnectionEnvironmentVariable) ?? LocalDatabaseConnection;

      public static DatabaseEngine TargetDatabaseEngine
      {
         get
         {
            var engine = Environment.GetEnvironmentVariable(DatabaseEngineEnvironmentVariable) ?? string.Empty;

            if (engine.ToUpper() == "MYSQL")
               return DatabaseEngine.MySQL;

            if (engine.ToUpper() == "SQLSERVER")
               return DatabaseEngine.SQLServer;

            Console.WriteLine($"'{DatabaseEngineEnvironmentVariable}' environment variable is not assigned, defaulting to {nameof(DatabaseEngine.SQLServer)}");
            return DatabaseEngine.SQLServer;
         }
      }

      public enum DatabaseEngine
      {
         SQLServer,
         MySQL
      }

      private const string DatabaseConnectionEnvironmentVariable = "MyMoney_Database_Connection";
      private const string DatabaseEngineEnvironmentVariable = "MyMoney_Database_Engine";
   }
}
