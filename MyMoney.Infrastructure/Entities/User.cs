using System;
using MyMoney.Core.Interfaces.Entites;

namespace MyMoney.Infrastructure.Entities
{
    public class User : BaseEntity, IUser
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string FullName { get; set; }
    }
}
