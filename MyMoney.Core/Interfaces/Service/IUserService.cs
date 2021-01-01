using System;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Results;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IUserService
   {
      LoginResult Login(string email, string passwordHash);
      LoginResult Register(string email, string password, DateTime dateOfBirth, string fullName);
      IUser GetById(long userId);
      void SendForgotPasswordEmail(string email, string baseUrl);
      BasicResult Update(long userId, string email, string fullName, DateTime dateOfBirth);
      BasicResult ChangePassword(long userId, string password);
   }
}
