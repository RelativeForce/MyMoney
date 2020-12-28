using MyMoney.Core.Email;

namespace MyMoney.Core.Interfaces.Email
{
   public interface IEmailManager
   {
      bool SendMail(EmailSettings emailConfig, EmailContent content);
   }
}