using MyMoney.Core.Email;

namespace MyMoney.Core.Interfaces.Email
{
   public interface IEmailManager
   {
      void SendMail(EmailSettings emailConfig, EmailContent content);
   }
}