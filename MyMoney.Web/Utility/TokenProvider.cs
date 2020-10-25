using Microsoft.IdentityModel.Tokens;
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
      public const string Secret = "dqSRHqsruH3U75hFSg1Y5LCOcON7G90iXGomYbaFuH4G10f2PIexSes3QlyidLC";

      public static readonly byte[] Key = Encoding.ASCII.GetBytes(Secret);

      public DateTime TokenTimeOut => DateTime.Now.AddHours(1);

      public string NewToken(IUser user)
      {
         var tokenHandler = new JwtSecurityTokenHandler();
         var tokenDescriptor = new SecurityTokenDescriptor
         {
            Subject = new ClaimsIdentity(new Claim[]
             {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
             }),
            Expires = TokenTimeOut,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Key), SecurityAlgorithms.HmacSha256Signature)
         };
         var token = tokenHandler.CreateToken(tokenDescriptor);

         return tokenHandler.WriteToken(token);
      }
   }
}
