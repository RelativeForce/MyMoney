using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace MyMoney.Local
{
   public sealed class Updater
   {
      public async Task EnsureLatestVersion()
      {
         using (var client = new HttpClient())
         {
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));

            try
            {
               var latestTag = await GetLatestTag(client);
               var latestVersion = new Version(latestTag.Substring(1));

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

      private static async Task<string> GetLatestTag(HttpClient client)
      {
         Console.WriteLine("Searching for latest version...");
         var response = await client.GetAsync($"{Constants.RepositoryURL}/releases/latest");
         var redirect = response.RequestMessage.RequestUri;
         return redirect.ToString().Split('/').Last();
      }

      private static bool ShouldDownloadLatest(Version latest)
      {
         // If the web app doesnt exist, download the latest
         if (!File.Exists(Constants.WebAppPath))
            return true;

         // Check the local version
         var fileData = FileVersionInfo.GetVersionInfo(Constants.WebAppPath);
         var localVersion = new Version(fileData.FileVersion);
         return latest > localVersion;
      }

      private static void EmptyExistingFolder()
      {
         if (Directory.Exists(Constants.WebAppFolder))
         {
            Directory.Delete(Constants.WebAppFolder, true);
         }

         Directory.CreateDirectory(Constants.WebAppFolder);
      }

      private static async Task DownloadLatest(HttpClient client, string latestTag, Version latestVersion)
      {
         var assetFileName = string.Format(Constants.AssetFileName, latestVersion.Major, latestVersion.Minor, latestVersion.Build);

         var assetURL = $"{Constants.RepositoryURL}/releases/download/{latestTag}/{assetFileName}";

         var fileResponse = await client.GetAsync(assetURL);

         var zipFilePath = Path.Combine(Directory.GetCurrentDirectory(), assetFileName);

         using (var ms = await fileResponse.Content.ReadAsStreamAsync())
         {
            using (var fs = File.Create(zipFilePath))
            {
               ms.Seek(0, SeekOrigin.Begin);
               ms.CopyTo(fs);
            }
         }

         ZipFile.ExtractToDirectory(zipFilePath, Constants.WebAppFolder);

         File.Delete(zipFilePath);
      }
   }
}
