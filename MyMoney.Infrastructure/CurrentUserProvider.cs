using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using MyMoney.Core;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Infrastructure
{
   public sealed class CurrentUserProvider : ICurrentUserProvider
   {

      private readonly IUserService _userService;
      private readonly IHttpContextAccessor _accessor;

      public CurrentUserProvider(IHttpContextAccessor accessor, IUserService userService)
      {
         _userService = userService;
         _accessor = accessor;
      }

      public long CurrentUserId
      {
         get
         {
            var claim = _accessor.HttpContext.User.Claims.First(c => c.Type.Equals(ClaimTypes.Name));

            return long.Parse(claim.Value);
         }
      }

      public IUser CurrentUser
      {
         get
         {
            var user = _userService.GetById(CurrentUserId);


            if (user == null)
               throw new Exception("Current user does not exist");

            return user;
         }
      }
   }
}
