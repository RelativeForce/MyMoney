using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using MyMoney.Application.Interfaces;
using MyMoney.Application.Interfaces.Services;
using MyMoney.Core.Email;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Results;
using MyMoney.Infrastructure.Entities;

namespace MyMoney.Application.Services
{
   public sealed class UserService : IUserService
   {
      private readonly IRepository _repository;
      private readonly ITokenProvider _tokenProvider;
      private readonly IEmailManager _emailManager;
      private readonly IResourceManager _resourceManager;

      public UserService(IRepository repository, ITokenProvider tokenProvider, IEmailManager emailManager, IResourceManager resourceManager)
      {
         _repository = repository;
         _tokenProvider = tokenProvider;
         _emailManager = emailManager;
         _resourceManager = resourceManager;
      }

      public LoginResult Login(string email, string passwordHash)
      {
         var user = _repository.All<User>().FirstOrDefault(u => u.Email.Equals(email));

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

         return LoginResult.SuccessResult(_tokenProvider.NewToken(user));
      }

      public LoginResult Register(string email, string password, DateTime dateOfBirth, string fullName)
      {
         if (!IsValidPassword(password))
            return LoginResult.FailResult("Invalid Password (Must: contain 1 uppercase, contain 1 number and be 8-15 characters long)");

         string savedPasswordHash = HashPassword(password);

         var user = new User
         {
            Email = email,
            FullName = fullName,
            Password = savedPasswordHash,
            DateOfBirth = dateOfBirth
         };

         var validationError = user.ValidationErrors().FirstOrDefault();
         if(validationError != null)
            return LoginResult.FailResult(validationError);

         if (_repository.All<User>().Any(u => u.Email.Equals(email)))
            return LoginResult.FailResult("Email already exists");

         user = _repository.Add(user);

         if (user == null)
            return LoginResult.FailResult("Database Error");

         return LoginResult.SuccessResult(_tokenProvider.NewToken(user));
      }

      public BasicResult Update(long userId, string email, string fullName, DateTime dateOfBirth)
      {
         var user = GetById(userId);
         if (user == null)
            return BasicResult.FailResult("No user with that id exists");

         user.Email = email;
         user.FullName = fullName;
         user.DateOfBirth = dateOfBirth;

         var validationError = user.ValidationErrors().FirstOrDefault();
         if (validationError != null)
            return BasicResult.FailResult(validationError);

         var emailTaken = _repository.All<User>().Any(u => u.Email == email && u.Id != userId);
         if (emailTaken)
            return BasicResult.FailResult("Email already exists");

         var success = _repository.Update(user);
         if (!success)
            return BasicResult.FailResult("Database Error");

         return BasicResult.SuccessResult();
      }

      public BasicResult ChangePassword(long userId, string password)
      {
         if (!IsValidPassword(password))
            return BasicResult.FailResult("Invalid Password (Must: contain 1 uppercase, contain 1 number and be 8-15 characters long)");

         var user = GetById(userId);
         if (user == null)
            return BasicResult.FailResult("No user with that id exists");

         string savedPasswordHash = HashPassword(password);

         user.Password = savedPasswordHash;

         var success = _repository.Update(user);
         if (!success)
            return BasicResult.FailResult("Database Error");

         return BasicResult.SuccessResult();
      }

      public void SendForgotPasswordEmail(string email, string baseUrl)
      {
         var userWithEmail = _repository.All<User>().FirstOrDefault(u => u.Email.Equals(email));
         if (userWithEmail == null)
            return;

         EmailSettings config = new EmailSettings
         {
            TOs = new string[] { email },
            FromDisplayName = "MyMoney",
            Subject = "Reset password"
         };

         var token = _tokenProvider.NewToken(userWithEmail);

         string contentString = _resourceManager.Load("reset-password-email.html");

         contentString = contentString
            .Replace("${site-name}", "MyMoney")
            .Replace("${reset-password-url}", $"{baseUrl}/auth/reset-password/{token.JWT}")
            .Replace("${site-url}", baseUrl);

         EmailContent content = new EmailContent
         {
            Content = contentString
         };

         _emailManager.SendMail(config, content);
      }

      public User GetById(long userId)
      {
         return _repository.All<User>().FirstOrDefault(u => u.Id == userId);
      }

      private static bool IsValidPassword(string password)
      {
         return Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$");
      }

      private static string HashPassword(string password)
      {
         byte[] salt = new byte[16];
         RandomNumberGenerator.Create().GetBytes(salt);

         var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000);
         byte[] hash = pbkdf2.GetBytes(20);

         byte[] hashBytes = new byte[36];
         Array.Copy(salt, 0, hashBytes, 0, 16);
         Array.Copy(hash, 0, hashBytes, 16, 20);

         return Convert.ToBase64String(hashBytes);
      }
   }
}
