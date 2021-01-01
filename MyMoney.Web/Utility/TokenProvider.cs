using Microsoft.IdentityModel.Tokens;
using MyMoney.Core;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyMoney.Web.Utility
{
   public class TokenProvider : ITokenProvider
   {
      private const string DefaultTokenSecret = "dqSRHqsruH3U75hFSg1Y5LCOcON7G90iXGomYbaFuH4G10f2PIexSes3QlyidLC";

      public static byte[] Key => _key ??= GetKey();
      public static byte[] _key;

      public Token NewToken(IUser user)
      {
         var expiryDateTime = GetExpiryDateTime();
         var tokenHandler = new JwtSecurityTokenHandler();
         var tokenDescriptor = new SecurityTokenDescriptor
         {
            Subject = new ClaimsIdentity(new Claim[]
             {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
             }),
            Expires = expiryDateTime,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Key), SecurityAlgorithms.HmacSha256Signature)
         };
         var token = tokenHandler.CreateToken(tokenDescriptor);

         return new Token(tokenHandler.WriteToken(token), expiryDateTime);
      }

      private static DateTime GetExpiryDateTime()
      {
         return DateTime.UtcNow.AddHours(1);
      }

      private static byte[] GetKey()
      {
         var secret = Environment.GetEnvironmentVariable(EnvironmentVariables.TokenSecret);

         if (string.IsNullOrWhiteSpace(secret))
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.TokenSecret, DefaultTokenSecret, true);
            secret = DefaultTokenSecret;
         }
         else
         {
            EnvironmentVariables.LogVariableValue(EnvironmentVariables.TokenSecret, secret);
         }

         return Encoding.ASCII.GetBytes(secret);
      }
   }
}
