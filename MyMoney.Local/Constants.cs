using MyMoney.Core;
using System;
using System.IO;

namespace MyMoney.Local
{
   public static class Constants
   {
      public static string WebAppPath => Path.Combine(WebAppFolder, "MyMoney.Web.exe");

      public static string WebAppFolder => _webAppFolder ??= GetWebAppFolder();
      private static string _webAppFolder;

      public static string RepositoryURL => _repositoryURL ??= GetRepositoryURL();
      private static string _repositoryURL;

      private static string GetWebAppFolder()
      {
         var path = Environment.GetEnvironmentVariable(EnvironmentVariables.LocalWebAppPath);

         if (string.IsNullOrWhiteSpace(path))
         {
            path = Path.Combine(Directory.GetCurrentDirectory(), "Web");

            EnvironmentVariables.LogVariableValue(EnvironmentVariables.LocalWebAppPath, path, true);
            return path;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.LocalWebAppPath, path);
         return path;
      }

      public static string GetRepositoryURL()
      {
         var url = Environment.GetEnvironmentVariable(EnvironmentVariables.GitHubRepositoryURL);

         if (string.IsNullOrWhiteSpace(url))
         {
            url = "https://github.com/RelativeForce/MyMoney";

            EnvironmentVariables.LogVariableValue(EnvironmentVariables.GitHubRepositoryURL, url, true);
            return url;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.GitHubRepositoryURL, url);
         return url;
      }
   }
}
