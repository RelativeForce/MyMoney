﻿using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace MyMoney.Local
{
   public class Program
   {
      public static void Main(string[] args)
      {
         var updater = new Updater();

         Task.Run(async () => await updater.EnsureLatestVersion()).Wait();

         Launch();
      }

      private static void Launch()
      {
         if (!File.Exists(Constants.WebAppPath))
            return;

         Console.WriteLine("Starting MyMoney...");

         ProcessStartInfo startInfo = new ProcessStartInfo(Constants.WebAppPath)
         {
            Verb = "runas",
            WorkingDirectory = Constants.WebAppFolder
         };

         var process = Process.Start(startInfo);
         if (process == null)
         {
            Console.WriteLine("Failed to start MyMoney");
         }
         else
         {
            process.WaitForExit();
         }
      }
   }
}
