using System;

namespace MyMoney.Client.Models.Request
{
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string FullName { get; set; }
    }
}
