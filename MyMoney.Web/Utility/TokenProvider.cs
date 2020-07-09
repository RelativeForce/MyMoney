using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Web.Utility
{
    public class TokenProvider : ITokenProvider
    {
        public const string Secret = "dqSRHqsruH3U75hFSg1Y5LCOcON7G90iXGomYbaFuH4G10f2PIexSes3QlyidLC";

        private static readonly byte[] Key = Encoding.ASCII.GetBytes(Secret);

       // private static readonly SigningCredentials SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Key), SecurityAlgorithms.HmacSha256Signature);

        public string NewToken(IUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Claims = new Dictionary<string, object>
                {
                    { "id", user.Id.ToString() }
                },
                Expires = DateTime.UtcNow.AddHours(1)
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

            var idString = securityToken.Claims.First(c => c.Type.Equals("id"))?.Value;

            return long.Parse(idString);
        }
    }
}
