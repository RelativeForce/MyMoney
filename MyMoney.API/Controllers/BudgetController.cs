using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Client.Models.Entity;
using MyMoney.Client.Models.Request;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class BudgetController : AuthorizedController
    {

        private readonly IUserService _userService;
        private readonly IBudgetService _budgetService;


        public BudgetController(IUserService userService, IBudgetService budgetService)
        {
            _userService = userService;
            _budgetService = budgetService;
        }

        [HttpPost(nameof(Find))]
        public IActionResult Find([FromBody]BudgetRequest findParameters)
        {
            try
            {
                if (findParameters == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var user = _userService.GetById(CurrentUserId);

                if (user == null)
                    return BadRequest("Error while retrieving user information");

                var result = _budgetService.Find(user, findParameters.Date);

                return Ok(new BudgetModel
                {
                    Id = result.Id,
                    Amount = result.Amount,
                    Month = result.Month
                });
            }
            catch (Exception)
            {
                return BadRequest("Error while creating");
            }
        }

        [HttpPost(nameof(Add))]
        public IActionResult Add([FromBody] BudgetModel registerParameters)
        {
            try
            {
                if (registerParameters == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var user = _userService.GetById(CurrentUserId);

                if (user == null)
                    return BadRequest("Error while retrieving user information");

                var result = _budgetService.Add(
                    user, 
                    registerParameters.Month, 
                    registerParameters.Amount
                    );

                return Ok(new BudgetModel
                {
                    Id = result.Id,
                    Amount = result.Amount,
                    Month = result.Month
                });

            }
            catch (Exception)
            {
                return BadRequest("Error while registering");
            }
        }
    }
}
