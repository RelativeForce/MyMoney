using System;
using MyMoney.Core.Results;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Interfaces.Services
{
   public interface IUserService
   {
      LoginResult Login(string email, string passwordHash);
      LoginResult Register(string email, string password, DateTime dateOfBirth, string fullName);
      User GetById(long userId);
      void SendForgotPasswordEmail(string email, string baseUrl);
      BasicResult Update(long userId, string email, string fullName, DateTime dateOfBirth);
      BasicResult ChangePassword(long userId, string password);
   }
}
