using System;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Core.Services
{
    public sealed class UserService : IUserService
    {
        private readonly IRepository _repository;
        private readonly IEntityFactory _entityFactory;
        private readonly ITokenProvider _tokenProvider;

        public UserService(IRepository repository, IEntityFactory entityFactory, ITokenProvider tokenProvider)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _tokenProvider = tokenProvider;
        }

        public LoginResult Login(string email, string passwordHash)
        {
            var user = _repository.Find<IUser>(u => u.Email.Equals(email));

            if (user == null)
                return LoginResult.FailResult("No user with that email exists");

            string savedPasswordHash = user.Password;

            /* Extract the bytes */
            byte[] hashBytes = Convert.FromBase64String(savedPasswordHash);

            /* Get the salt */
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            /* Compute the hash on the password the user entered */
            var pbkdf2 = new Rfc2898DeriveBytes(passwordHash, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);

            /* Compare the results */
            for (int i = 0; i < 20; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                    return LoginResult.FailResult("Incorrect password");
            }

            var token = _tokenProvider.NewToken(user);

            return LoginResult.SuccessResult(token);
        }

        public LoginResult Register(string email, string password, DateTime dateOfBirth, string fullName)
        {
            if(!IsValidEmail(email))
                return LoginResult.FailResult("Invalid Email");

            if (string.IsNullOrWhiteSpace(fullName))
                return LoginResult.FailResult("Invalid Name");

            if(!IsValidPassword(password))
                return LoginResult.FailResult("Invalid Password (Must: contain 1 uppercase, contain 1 number and be 8-15 characters long)");

            if (dateOfBirth >= DateTime.Today)
                return LoginResult.FailResult("Invalid Date of Birth");

            if(_repository.Find<IUser>(u => u.Email.Equals(email)) != null)
                return LoginResult.FailResult("Email already exists");

            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);

            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);

            string savedPasswordHash = Convert.ToBase64String(hashBytes);

            var user = _entityFactory.NewUser;

            user.Email = email;
            user.FullName = fullName;
            user.Password = savedPasswordHash;
            user.DateOfBirth = dateOfBirth;

            user = _repository.Add(user);

            if(user == null)
                return LoginResult.FailResult("Database Error");

            var token = _tokenProvider.NewToken(user);

            return LoginResult.SuccessResult(token);
        }

        public IUser GetById(long userId)
        {
            return _repository.FindById<IUser>(userId);
        }

        private static bool IsValidEmail(string emailAddress)
        {
            try
            {
                var m = new MailAddress(emailAddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        private static bool IsValidPassword(string password)
        {
            return Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$");
        }
    }
}
