using MyMoney.Core;
using System;

namespace MyMoney.Infrastructure.EntityFramework
{
   public static class FrontEndConstants
   {
      public static FrontEndFramework TargetFrontEndFramework => _targetFrontEndFramework ??= GetTargetFrontEndFramework();
      private static FrontEndFramework? _targetFrontEndFramework;

      private static FrontEndFramework GetTargetFrontEndFramework()
      {
         var engine = Environment.GetEnvironmentVariable(EnvironmentVariables.FrontEndFramework) ?? string.Empty;

         if (engine.ToUpper() == "REACT")
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseEngine, nameof(FrontEndFramework.React));
            return FrontEndFramework.React;
         }

         if (engine.ToUpper() == "ANGULAR")
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseEngine, nameof(FrontEndFramework.Anuglar));
            return FrontEndFramework.Anuglar;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.DatabaseEngine, nameof(FrontEndFramework.Anuglar), true);
         return FrontEndFramework.Anuglar;
      }

      public enum FrontEndFramework
      {
         Anuglar,
         React
      }
   }
}
