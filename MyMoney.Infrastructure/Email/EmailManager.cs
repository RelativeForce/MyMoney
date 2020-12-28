﻿using System;
using System.Net.Mail;
using System.Net.Mime;
using MyMoney.Core;
using MyMoney.Core.Email;
using MyMoney.Core.Interfaces.Email;

namespace MyMoney.Infrastructure.Email
{
   public class EmailManager : IEmailManager
   {
      private string _smtpServer;
      private string _clientEmailAddress;
      private string _clientEmailPassword;

      public EmailManager()
      {
         _smtpServer = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailSmtpServer);
         _clientEmailAddress = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailAddress);
         _clientEmailPassword = Environment.GetEnvironmentVariable(EnvironmentVariables.EmailPassword);

         if (_smtpServer == null)
            throw new ApplicationException($"'{EnvironmentVariables.EmailSmtpServer}' is missing");

         if (_clientEmailAddress == null)
            throw new ApplicationException($"'{EnvironmentVariables.EmailAddress}' is missing");

         if (_clientEmailPassword == null)
            throw new ApplicationException($"'{EnvironmentVariables.EmailPassword}' is missing");
      }

      public bool SendMail(EmailSettings emailConfig, EmailContent content)
      {
         MailMessage email = ConstructEmailMessage(emailConfig, content);
         return Send(email);
      }

      private MailMessage ConstructEmailMessage(EmailSettings emailConfig, EmailContent content)
      {
         MailMessage msg = new MailMessage();
         foreach (string to in emailConfig.TOs)
         {
            if (!string.IsNullOrEmpty(to))
            {
               msg.To.Add(to);
            }
         }

         foreach (string cc in emailConfig.CCs)
         {
            if (!string.IsNullOrEmpty(cc))
            {
               msg.CC.Add(cc);
            }
         }

         msg.From = new MailAddress(emailConfig.From,
                                    emailConfig.FromDisplayName,
                                    System.Text.Encoding.UTF8);
         msg.IsBodyHtml = content.IsHtml;
         msg.Body = content.Content;
         msg.Priority = emailConfig.Priority;
         msg.Subject = emailConfig.Subject;
         msg.BodyEncoding = System.Text.Encoding.UTF8;
         msg.SubjectEncoding = System.Text.Encoding.UTF8;

         if (content.AttachFileName != null)
         {
            Attachment data = new Attachment(content.AttachFileName,
                                             MediaTypeNames.Application.Zip);
            msg.Attachments.Add(data);
         }

         return msg;
      }

      private bool Send(MailMessage message)
      {
         SmtpClient client = new SmtpClient
         {
            UseDefaultCredentials = false,
            Credentials = new System.Net.NetworkCredential(_clientEmailAddress, _clientEmailPassword),
            Host = _smtpServer,
            Port = 25,  // this is critical
            EnableSsl = true  // this is critical
         };

         try
         {
            client.Send(message);
            return true;
         }
         catch (Exception e)
         {
            Console.WriteLine("Failed to send email: {0}", e.Message);
            return false;
         }
         finally
         {
            message.Dispose();
         }
      }
   }
}
