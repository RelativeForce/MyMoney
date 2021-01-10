using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using MyMoney.Core;

namespace MyMoney.Local
{
   public class Program
   {
      private static string WebAppFolder => Environment.GetEnvironmentVariable(EnvironmentVariables.LocalWebAppPath) ?? Path.Combine(Directory.GetCurrentDirectory(), "Web");
      private static string WebAppPath => Path.Combine(WebAppFolder, "MyMoney.Web.exe");
      private static string RepositoryURl => Environment.GetEnvironmentVariable(EnvironmentVariables.GitHubRepositoryURL) ?? "https://github.com/RelativeForce/MyMoney";

      public static void Main(string[] args)
      {
         Task.Run(async () => await EnsureLatestVersion()).Wait();

         Launch();
      }

      private static void Launch()
      {
         if (!File.Exists(WebAppPath))
            return;

         try
         {
            Console.WriteLine("Starting MyMoney...");
            var process = Process.Start(WebAppPath);
            if (process == null)
            {
               Console.WriteLine("Failed to start MyMoney");
            }
            else
            {
               process.WaitForExit();
            }
         }
         catch (Exception e)
         {
            Console.WriteLine(e);

            Console.WriteLine("\n\nPress any key to close...");
            Console.ReadLine();
         }
      }

      private static async Task<string> GetLatestTag(HttpClient client)
      {
         Console.WriteLine("Searching for latest version...");
         var response = await client.GetAsync($"{RepositoryURl}/releases/latest");
         var redirect = response.RequestMessage.RequestUri;
         return redirect.ToString().Split('/').Last();
      }

      private static bool ShouldDownloadLatest(Version latest)
      {
         // If the web app doesnt exist, download the latest
         if (!File.Exists(WebAppPath))
            return true;

         // Check the local version
         var fileData = FileVersionInfo.GetVersionInfo(WebAppPath);
         var localVersion = new Version(fileData.FileVersion);
         return latest > localVersion;
      }

      private static void EmptyExistingFolder()
      {
         if (Directory.Exists(WebAppFolder))
         {
            Directory.Delete(WebAppFolder, true);
         }

         Directory.CreateDirectory(WebAppFolder);
      }

      private static async Task DownloadLatest(HttpClient client, string latestTag, Version latestVersion)
      {
         var assetPath = string.Format(RepositoryURl + "/releases/download/{0}/MyMoney_win64_{1}-{2}-{3}.zip", latestTag, latestVersion.Major, latestVersion.Minor, latestVersion.Build);

         var fileResponse = await client.GetAsync(assetPath);

         var zipFilePath = Path.Combine(Directory.GetCurrentDirectory(), $"{DateTime.UtcNow.ToFileTimeUtc()}.zip");

         await using (var ms = await fileResponse.Content.ReadAsStreamAsync())
         {
            await using (var fs = File.Create(zipFilePath))
            {
               ms.Seek(0, SeekOrigin.Begin);
               ms.CopyTo(fs);
            }
         }

         ZipFile.ExtractToDirectory(zipFilePath, WebAppFolder);

         File.Delete(zipFilePath);
      }

      private static async Task EnsureLatestVersion()
      {
         using (var client = new HttpClient())
         {
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));

            try
            {
               var latestTag = await GetLatestTag(client);
               var latestVersion = new Version(latestTag[1..]);

               if (!ShouldDownloadLatest(latestVersion))
               {
                  Console.WriteLine($"Already using latest version {latestTag}");
                  return;
               }

               Console.WriteLine($"Downloading latest version {latestTag}...");
               EmptyExistingFolder();
               await DownloadLatest(client, latestTag, latestVersion);
            }
            catch (Exception e)
            {
               Console.WriteLine("Failed check for new version");
               Console.WriteLine(e);
            }
         }
      }
   }
}
