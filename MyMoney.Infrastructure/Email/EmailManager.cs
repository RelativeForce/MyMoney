using System;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using MyMoney.Core.Email;
using MyMoney.Core.Interfaces.Email;

namespace MyMoney.Infrastructure.Email
{
   public class EmailManager : IEmailManager
   {
      private readonly string _smtpServer;
      private readonly int _port;
      private readonly bool _enableSsl;
      private readonly string _clientEmailAddress;
      private readonly string _clientEmailPassword;

      public EmailManager()
      {
         _smtpServer = EmailConstants.SMTPServerURL;
         _port = EmailConstants.SmtpServerPort;
         _enableSsl = EmailConstants.SmtpServerSSL;
         _clientEmailAddress = EmailConstants.ClientEmailAddress;
         _clientEmailPassword = EmailConstants.ClientEmailPassword;
      }

      public void SendMail(EmailSettings config, EmailContent content)
      {
         if (!HasClientAccount())
         {
            SaveEmail(content.IsHtml, content.Content);
            return;
         }

         MailMessage email = ConstructEmailMessage(config, content);

         Send(email);
      }

      private MailMessage ConstructEmailMessage(EmailSettings config, EmailContent content)
      {
         MailMessage message = new MailMessage();

         foreach (string to in config.TOs.Where(to => !string.IsNullOrWhiteSpace(to)))
         {
            message.To.Add(to);
         }

         foreach (string cc in config.CCs.Where(cc => !string.IsNullOrWhiteSpace(cc)))
         {
            message.CC.Add(cc);
         }

         message.From = new MailAddress(_clientEmailAddress, config.FromDisplayName, System.Text.Encoding.UTF8);
         message.IsBodyHtml = content.IsHtml;
         message.Body = content.Content;
         message.Priority = config.Priority;
         message.Subject = config.Subject;
         message.BodyEncoding = System.Text.Encoding.UTF8;
         message.SubjectEncoding = System.Text.Encoding.UTF8;

         if (!string.IsNullOrWhiteSpace(content.AttachFileName))
         {
            Attachment data = new Attachment(content.AttachFileName, MediaTypeNames.Application.Zip);
            message.Attachments.Add(data);
         }

         return message;
      }

      private void Send(MailMessage message)
      {
         SmtpClient client = new SmtpClient
         {
            UseDefaultCredentials = false,
            Credentials = new System.Net.NetworkCredential(_clientEmailAddress, _clientEmailPassword),
            DeliveryMethod = SmtpDeliveryMethod.Network,
            Host = _smtpServer,
            Port = _port,
            EnableSsl = _enableSsl
         };

         try
         {
            client.Send(message);
            Console.WriteLine($"Email sent to {message.To}");
         }
         catch(Exception e)
         {
            SaveEmail(message.IsBodyHtml, message.Body);
            throw e;
         }
         finally
         {
            message.Dispose();
         }
      }

      private bool HasClientAccount()
      {
         if (_smtpServer == null || _clientEmailAddress == null || _clientEmailPassword == null || _port == -1) { 
            Console.WriteLine($"Email environment variable(s) is missing, sending emails is disabled");
            return false;
         }

         return true;
      }

      private void SaveEmail(bool isHtml, string contents)
      {
         string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Emails");
         if (!Directory.Exists(folderPath)) {
            Directory.CreateDirectory(folderPath); 
         }

         string fileName = $"{DateTime.UtcNow.ToFileTimeUtc()}.{(isHtml ? "html" : "txt")}";
         string filePath = Path.Combine(folderPath, fileName);

         File.WriteAllText(filePath, contents);
         Console.WriteLine($"Saved email contents to {filePath}");
      }
   }
}
