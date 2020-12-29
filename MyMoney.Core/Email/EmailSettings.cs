using System.Net.Mail;

namespace MyMoney.Core.Email
{
   public class EmailSettings
   {
      public string[] TOs { get; set; } = new string[0];
      public string[] CCs { get; set; } = new string[0];
      public string FromDisplayName { get; set; } = "";
      public string Subject { get; set; } = "";
      public MailPriority Priority { get; set; } = MailPriority.Normal;
   }
}
