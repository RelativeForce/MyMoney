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
      public IActionResult Find([FromBody] FindRequest findParameters)
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
               return Ok(new BudgetModel(budget));
            }

            return NotFound("Transaction does not exist");
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
         }
      }

      [HttpPost(nameof(List))]
      public IActionResult List([FromBody] BudgetRequest findParameters)
      {
         try
         {
            if (findParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var budgets = _budgetService.List(findParameters.MonthId);

            if (budgets == null)
               return NotFound();

            return Ok(new BudgetListResponse
            {
               Budgets = budgets.Select(t => new BudgetModel(t)).ToList()
            });
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

      [HttpPost(nameof(Update))]
      public IActionResult Update([FromBody] BudgetModel model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var success = _budgetService.Update(model.Id, model.MonthId, model.Name, model.Amount, model.Notes);

            return Ok(new UpdateResponse
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
      public IActionResult Delete([FromBody] DeleteRequest deleteParameters)
      {
         try
         {
            if (deleteParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _budgetService.Delete(deleteParameters.Id);

            return Ok(new DeleteResponse { Success = result });
         }
         catch (Exception)
         {
            return BadRequest("Error while deleting");
         }
      }
   }
}
