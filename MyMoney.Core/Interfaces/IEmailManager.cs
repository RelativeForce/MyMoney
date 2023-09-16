using MyMoney.Core.Email;

namespace MyMoney.Core.Interfaces
{
   public interface IEmailManager
   {
      void SendMail(EmailSettings emailConfig, EmailContent content);
   }
}