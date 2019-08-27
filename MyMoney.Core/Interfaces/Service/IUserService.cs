using System;
using MyMoney.Core.Services;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IUserService
    {
        LoginResult Login(string email, string passwordHash);
        LoginResult Register(string email, string passwordHash, DateTime dateOfBirth, string fullName);
    }
}
