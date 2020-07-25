using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Web.Models.Entity;
using MyMoney.Web.Models.Request;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.Web.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly IBudgetService _budgetService;

        public BudgetController(IBudgetService budgetService)
        {
            _budgetService = budgetService;
        }

        [HttpPost(nameof(Find))]
        public IActionResult Find([FromBody] BudgetRequest findParameters)
        {
            try
            {
                if (findParameters == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var result = _budgetService.Find(findParameters.MonthId);

                if (result == null)
                    return NotFound();

                return Ok(new BudgetModel(result));
            }
            catch (Exception)
            {
                return BadRequest("Error while creating");
            }
        }

        [HttpPost(nameof(Add))]
        public IActionResult Add([FromBody] BudgetModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var result = _budgetService.Add(
                    model.MonthId,
                    model.Name,
                    model.Amount,
                    model.Notes
                );

                if (result == null)
                    return BadRequest("Invalid budget data");

                return Ok(new BudgetModel(result));

            }
            catch (Exception)
            {
                return BadRequest("Error while registering");
            }
        }
    }
}
