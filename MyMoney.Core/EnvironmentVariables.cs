﻿using System;

namespace MyMoney.Core
{
   public static class EnvironmentVariables
   {
      public const string TokenSecret = "MyMoney_Token_Secret";

      // Database
      public const string DatabaseConnection = "MyMoney_Database_Connection";
      public const string DatabaseEngine = "MyMoney_Database_Engine";

      // Update
      public const string LocalWebAppPath = "MyMoney_Local_Web_App_Path";
      public const string GitHubRepositoryURL = "MyMoney_GitHub_URL";
      public const string AssetFileName = "MyMoney_Asset_File_Name";

      // Email
      public const string EmailSmtpServerURL = "MyMoney_Email_Smtp_Server_URL";
      public const string EmailSmtpServerPort = "MyMoney_Email_Smtp_Server_Port";
      public const string EmailSmtpServerSSL = "MyMoney_Email_Smtp_Server_SSL";
      public const string EmailAddress = "MyMoney_Email_Address";
      public const string EmailPassword = "MyMoney_Email_Password";

      // FrontEnd
      public const string FrontEndFramework = "MyMoney_Front_End_Framework";

      public static void LogVariableValue(string environmentVariable, string value, bool isDefault = false)
      {
         Console.WriteLine($"{environmentVariable}: '{value}'{(isDefault ? " (default)" : "")}");
      }

      public static void LogVariableMissing(string environmentVariable)
      {
         Console.WriteLine($"{environmentVariable}: MISSING");
      }
   }
}
