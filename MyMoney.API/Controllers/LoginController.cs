using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {

        private readonly IUserService _userService;

        public LoginController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public IActionResult Login([FromBody]LoginRequest loginParameters)
        {
            try
            {
                if (loginParameters == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var result = _userService.Login(loginParameters.Email, loginParameters.Password);

                return Ok(new LoginResponse
                {
                    Success = result.Success,
                    Error = result.Error,
                    Token = result.Token
                });
            }
            catch (Exception)
            {
                return BadRequest("Error while creating");
            }
        }

        [HttpPost]
        public IActionResult Register([FromBody] RegisterRequest registerParameters)
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

                return Ok(new LoginResponse
                {
                    Success = result.Success,
                    Error = result.Error,
                    Token = result.Token
                });

            }
            catch (Exception)
            {
                return BadRequest("Error while registering");
            }
        }
    }
}
