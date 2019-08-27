using System;

namespace MyMoney.Core.Interfaces.Entites
{
    public interface IUser : IBaseEntity
    {
        string Email { get; set; }
        string PasswordHash { get; set; }
        DateTime DateOfBirth { get; set; }
        string FullName { get; set; }
    }
}
