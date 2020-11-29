using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Core.Interfaces.Service;
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

      private readonly IUserService _userService;

      public UserController(IUserService userService)
      {
         _userService = userService;
      }

      [HttpPost(nameof(Login))]
      public IActionResult Login([FromBody] LoginDto loginParameters)
      {
         try
         {
            if (loginParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _userService.Login(loginParameters.Email, loginParameters.Password);

            return Ok(new LoginResultDto(result));
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
         }
      }

      [HttpPost(nameof(Register))]
      public IActionResult Register([FromBody] RegisterDto registerParameters)
      {
         try
         {
            if (registerParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _userService.Register(
                registerParameters.Email,
                registerParameters.Password,
                registerParameters.DateOfBirth,
                registerParameters.FullName
                );

            return Ok(new LoginResultDto(result));

         }
         catch (Exception)
         {
            return BadRequest("Error while registering");
         }
      }
   }
}
