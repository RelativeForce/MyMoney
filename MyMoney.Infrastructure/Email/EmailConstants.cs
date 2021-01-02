using MyMoney.Core;
using System;

namespace MyMoney.Infrastructure.Email
{
   public static class EmailConstants
   {
      public static string SMTPServerURL => _smtpServerURL ??= GetSTMPServerURL();
      private static string _smtpServerURL;

      public static string ClientEmailAddress => _clientEmailAddress ??= GetClientEmailAddress();
      private static string _clientEmailAddress;

      public static string ClientEmailPassword => _clientEmailPassword ??= GetClientEmailPassword();
      private static string _clientEmailPassword;

      public static int SmtpServerPort => _smtpServerPort ??= GetSmtpServerPort();
      private static int? _smtpServerPort;

      public static bool SmtpServerSSL => _smtpServerSSL ??= GetSmtpServerSSL();
      private static bool? _smtpServerSSL;

      private static string GetSTMPServerURL()
      {
         var url = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailSmtpServerURL);

         if (string.IsNullOrWhiteSpace(url))
         {
            EnvironmentVariables.LogVariableMissing(EnvironmentVariables.EmailSmtpServerURL);
            return null;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.EmailSmtpServerURL, url);
         return url;
      }

      private static string GetClientEmailAddress()
      {
         var address = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailAddress);

         if (string.IsNullOrWhiteSpace(address))
         {
            EnvironmentVariables.LogVariableMissing(EnvironmentVariables.EmailAddress);
            return null;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.EmailAddress, address);
         return address;
      }

      private static string GetClientEmailPassword()
      {
         var password = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailPassword);

         if (string.IsNullOrWhiteSpace(password))
         {
            EnvironmentVariables.LogVariableMissing(EnvironmentVariables.EmailPassword);
            return null;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.EmailPassword, password);
         return password;
      }

      private static int GetSmtpServerPort()
      {
         var portString = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailSmtpServerPort) ?? string.Empty;

         if(int.TryParse(portString, out int port))
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.EmailSmtpServerPort, port.ToString());
            return port;
         }

         // Invalid port number
         EnvironmentVariables.LogVariableMissing(EnvironmentVariables.EmailSmtpServerPort);
         return -1;
      }

      private static bool GetSmtpServerSSL()
      {
         var sslString = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailSmtpServerSSL) ?? string.Empty;

         if (bool.TryParse(sslString, out bool ssl))
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.EmailSmtpServerSSL, ssl.ToString());
            return ssl;
         }

         EnvironmentVariables.LogVariableValue(EnvironmentVariables.EmailSmtpServerSSL, true.ToString(), true);
         return true;
      }
   }
}
