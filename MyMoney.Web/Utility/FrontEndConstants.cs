using System;
using MyMoney.Core;

namespace MyMoney.Web.Utility
{
   public static class FrontEndConstants
   {
      private const string DefaultFrontEndFramework = "Angular";

      public static string TargetFrontEndFramework => _targetFrontEndFramework ??= GetTargetFrontEndFramework();
      private static string? _targetFrontEndFramework;

      private static string GetTargetFrontEndFramework()
      {
         var framework = Environment.GetEnvironmentVariable(EnvironmentVariables.FrontEndFramework) ?? string.Empty;

         if (string.IsNullOrWhiteSpace(framework))
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.FrontEndFramework, DefaultFrontEndFramework, true);
            return DefaultFrontEndFramework;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.FrontEndFramework, framework);
         return framework;
      }
   }
}
