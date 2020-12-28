using System.Net.Mail;

namespace MyMoney.Core.Email
{
   public class EmailSettings
   {
      public string[] TOs { get; set; }
      public string[] CCs { get; set; }
      public string From { get; set; }
      public string FromDisplayName { get; set; }
      public string Subject { get; set; }
      public MailPriority Priority { get; set; }
   }
}
