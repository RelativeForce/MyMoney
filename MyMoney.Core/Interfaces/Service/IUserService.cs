using System;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Services;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IUserService
   {
      LoginResult Login(string email, string passwordHash);
      LoginResult Register(string email, string password, DateTime dateOfBirth, string fullName);
      IUser GetById(long userId);
   }
}
