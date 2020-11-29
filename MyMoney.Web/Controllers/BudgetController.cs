using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Core.Interfaces.Service;
using MyMoney.Web.Models.Entity;
using MyMoney.Web.Models.Request;
using MyMoney.Web.Models.Response;
using System;
using System.Linq;

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
      public IActionResult Find([FromBody] IdDto findParameters)
      {
         try
         {
            if (findParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var budget = _budgetService.Find(findParameters.Id);

            if (budget != null)
            {
               return Ok(new BudgetDto(budget));
            }

            return NotFound("Budget does not exist");
         }
         catch (Exception)
         {
            return BadRequest("Error while finding budget");
         }
      }

      [HttpPost(nameof(List))]
      public IActionResult List([FromBody] BudgetSearchDto findParameters)
      {
         try
         {
            if (findParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var budgets = _budgetService.List(findParameters.Month, findParameters.Year);

            if (budgets == null)
               return NotFound();

            return Ok(new BudgetListDto
            {
               Budgets = budgets.Select(t => new BudgetDto(t)).ToList()
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while listing budgets");
         }
      }

      [HttpPost(nameof(Add))]
      public IActionResult Add([FromBody] BudgetDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _budgetService.Add(
                model.Month,
                model.Year,
                model.Name,
                model.Amount,
                model.Notes
            );

            if (result == null)
               return BadRequest("Invalid budget data");

            return Ok(new BudgetDto(result));

         }
         catch (Exception)
         {
            return BadRequest("Error while adding budget");
         }
      }

      [HttpPost(nameof(Update))]
      public IActionResult Update([FromBody] BudgetDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var success = _budgetService.Update(model.Id, model.Month, model.Year, model.Name, model.Amount, model.Notes);

            return Ok(new UpdateResultDto
            {
               Success = success,
               Error = success ? "" : "Invalid budget information"
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while updating");
         }
      }

      [HttpPost(nameof(Delete))]
      public IActionResult Delete([FromBody] IdDto deleteParameters)
      {
         try
         {
            if (deleteParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _budgetService.Delete(deleteParameters.Id);

            return Ok(new DeleteResultDto { Success = result });
         }
         catch (Exception)
         {
            return BadRequest("Error while deleting");
         }
      }
   }
}
