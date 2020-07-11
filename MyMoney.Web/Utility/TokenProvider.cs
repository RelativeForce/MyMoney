using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;

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

        public long? GetUserId(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            if (!tokenHandler.CanReadToken(token))
            {
                return null;
            }

            var securityToken = tokenHandler.ReadJwtToken(token);

            if (DateTime.UtcNow > securityToken.ValidTo)
            {
                return null;
            }

            var idString = securityToken.Claims.First(c => c.Type.Equals(ClaimTypes.Name))?.Value;

            return idString == null ? (long?) null : long.Parse(idString);
        }
    }
}
