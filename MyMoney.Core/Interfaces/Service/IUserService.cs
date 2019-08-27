using System;
using System.Collections.Generic;
using System.Text;

namespace MyMoney.Core.Interfaces.Service
{
    public interface IUserService
    {
        bool Login(string email, string passwordHash);
    }
}
