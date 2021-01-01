using MyMoney.Core;
using System;

namespace MyMoney.Infrastructure.EntityFramework
{
   public static class DatabaseConstants
   {
      public const string LocalDatabaseConnection = @"Server=.\SQLEXPRESS;Initial Catalog=MyMoney;Trusted_Connection=True;MultipleActiveResultSets=true;Integrated Security=True";

      public static string DatabaseConnection => _databaseConnection ??= GetDatabaseConnection();
      private static string _databaseConnection;

      public static DatabaseEngine TargetDatabaseEngine => _targetDatabaseEngine ??= GetTargetDatabaseEngine();
      private static DatabaseEngine? _targetDatabaseEngine;

      private static string GetDatabaseConnection()
      {
         var connectionString = Environment.GetEnvironmentVariable(EnvironmentVariables.DatabaseConnection) ?? string.Empty;

         if (!string.IsNullOrWhiteSpace(connectionString))
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseConnection, connectionString);
            return connectionString;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseConnection, LocalDatabaseConnection, true);
         return LocalDatabaseConnection;
      }

      private static DatabaseEngine GetTargetDatabaseEngine()
      {
         var engine = Environment.GetEnvironmentVariable(EnvironmentVariables.DatabaseEngine) ?? string.Empty;

         if (engine.ToUpper() == "MYSQL")
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseEngine, nameof(DatabaseEngine.MySQL));
            return DatabaseEngine.MySQL;
         }

         if (engine.ToUpper() == "SQLSERVER")
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseEngine, nameof(DatabaseEngine.SQLServer));
            return DatabaseEngine.SQLServer;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseEngine, nameof(DatabaseEngine.SQLServer), true);
         return DatabaseEngine.SQLServer;
      }

      public enum DatabaseEngine
      {
         SQLServer,
         MySQL
      }
   }
}
