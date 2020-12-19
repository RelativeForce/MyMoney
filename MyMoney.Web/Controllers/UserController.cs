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
   [Route("[controller]")]
   public class UserController : ControllerBase
   {
      private readonly ICurrentUserProvider _userProvider;
      private readonly IUserService _userService;

      public UserController(ICurrentUserProvider userProvider, IUserService userService)
      {
         _userProvider = userProvider;
         _userService = userService;
      }

      [HttpPost(nameof(SignedInUser))]
      public IActionResult SignedInUser()
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

      [HttpPost(nameof(UpdateSignedInUser))]
      public IActionResult UpdateSignedInUser(UserDto dto)
      {
         if (dto == null || !ModelState.IsValid)
         {
            return BadRequest("Invalid State");
         }

         try
         {
            var userId = _userProvider.CurrentUserId;

            var result = _userService.Update(userId, dto.Email, dto.FullName, DateTime.Parse(dto.DateOfBirth));

            return Ok(result);
         }
         catch (Exception)
         {
            return BadRequest("Error while updating the current user's details");
         }
      }
   }
}
