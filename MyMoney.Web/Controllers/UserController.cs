using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Core;
using MyMoney.Core.Interfaces.Service;
using MyMoney.Web.Models.Entity;
using MyMoney.Web.Models.Request;
using MyMoney.Web.Models.Response;
using System;

namespace MyMoney.Web.Controllers
{
   [ApiController]
   [AllowAnonymous]
   [Route("[controller]")]
   public class UserController : ControllerBase
   {
      private readonly ICurrentUserProvider _userProvider;

      public UserController(ICurrentUserProvider userProvider)
      {
         _userProvider = userProvider;
      }

      [HttpPost(nameof(Details))]
      public IActionResult Details()
      {
         try
         {
            var result = _userProvider.CurrentUser;

            return Ok(new UserDto(result));
         }
         catch (Exception)
         {
            return BadRequest("Error while retrieving current user details");
         }
      }
   }
}
