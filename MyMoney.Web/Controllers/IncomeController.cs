using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Web.Models.Common;
using MyMoney.Web.Models.Entity;
using MyMoney.Web.Models.Request;
using MyMoney.Web.Models.Response;
using System;
using System.Linq;
using MyMoney.Application.Interfaces.Services;

namespace MyMoney.Web.Controllers
{
   [ApiController]
   [Authorize]
   [Route("[controller]")]
   public class IncomeController : ControllerBase
   {
      private readonly IBasicIncomeService _basicIncomeService;
      private readonly IRecurringIncomeService _recurringIncomeService;

      public IncomeController(IBasicIncomeService incomeService, IRecurringIncomeService recurringIncomeService)
      {
         _basicIncomeService = incomeService;
         _recurringIncomeService = recurringIncomeService;
      }

      [HttpPost(nameof(List))]
      public IActionResult List([FromBody] DateRangeDto listParameters)
      {
         try
         {
            if (listParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var basic = _basicIncomeService.Between(listParameters.Start, listParameters.End);
            var recurring = _recurringIncomeService.Between(listParameters.Start, listParameters.End);

            return Ok(new IncomeListDto
            {
               Incomes = basic
                  .Concat(recurring)
                  .OrderByDescending(i => i.Date)
                  .Select(t => new IncomeDto(t))
                  .ToList()
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while listing incomes");
         }
      }

      [HttpPost(nameof(ListCount))]
      public IActionResult ListCount([FromBody] IncomeSearchDto listParameters)
      {
         try
         {
            if (listParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var basic = _basicIncomeService.From(listParameters.Date, listParameters.Count);
            var recurring = _recurringIncomeService.From(listParameters.Date, listParameters.Count);

            return Ok(new IncomeListDto
            {
               Incomes = basic
               .Concat(recurring)
               .OrderByDescending(i => i.Date)
               .Take(listParameters.Count)
               .Select(t => new IncomeDto(t))
               .ToList()
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while listing incomes");
         }
      }

      #region Basic

      [HttpPost(nameof(Find))]
      public IActionResult Find([FromBody] IdDto dto)
      {
         try
         {
            if (dto == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var income = _basicIncomeService.Find(dto.Id);

            if (income != null)
            {
               return Ok(new IncomeDto(income));
            }

            return NotFound("Income does not exist");
         }
         catch (Exception)
         {
            return BadRequest("Error while finding income");
         }
      }

      [HttpPost(nameof(Add))]
      public IActionResult Add([FromBody] IncomeDto dto)
      {
         try
         {
            if (dto == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _basicIncomeService.Add(DateTime.Parse(dto.Date), dto.Name, dto.Amount, dto.Notes);

            if (result == null)
               return BadRequest("Invalid income data");

            return Ok(new IncomeDto(result));
         }
         catch (Exception)
         {
            return BadRequest("Error while adding income");
         }
      }

      [HttpPost(nameof(Update))]
      public IActionResult Update([FromBody] IncomeDto dto)
      {
         try
         {
            if (dto == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var success = _basicIncomeService.Update(dto.Id, DateTime.Parse(dto.Date), dto.Name, dto.Amount, dto.Notes);

            return Ok(new UpdateResultDto
            {
               Success = success,
               Error = success ? "" : "Invalid income information"
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

            var result = _basicIncomeService.Delete(deleteParameters.Id);

            return Ok(new DeleteResultDto { Success = result });
         }
         catch (Exception)
         {
            return BadRequest("Error while deleting");
         }
      }

      #endregion Basic

      #region Recurring

      [HttpPost(nameof(AddRecurring))]
      public IActionResult AddRecurring([FromBody] RecurringIncomeDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _recurringIncomeService.Add(DateTime.Parse(model.Start), DateTime.Parse(model.End), model.Name, model.Amount, model.Notes, model.Recurrence);

            if (result == null)
               return BadRequest("Invalid State");

            return Ok(new RecurringIncomeDto(result));
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
         }
      }

      [HttpPost(nameof(Realise))]
      public IActionResult Realise([FromBody] RecurringEntityChildDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _recurringIncomeService.Realise(model.Id, DateTime.Parse(model.Date));

            if (result == null)
               return BadRequest("Invalid State");

            return Ok(new IncomeDto(result));
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
         }
      }

      [HttpPost(nameof(FindRecurring))]
      public IActionResult FindRecurring([FromBody] IdDto findParameters)
      {
         try
         {
            if (findParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var income = _recurringIncomeService.Find(findParameters.Id);

            if (income != null)
            {
               var children = income.Children();

               return Ok(new RecurringIncomeDto(income, children));
            }

            return NotFound("Recurriung income does not exist");
         }
         catch (Exception)
         {
            return BadRequest("Error while searching");
         }
      }

      [HttpPost(nameof(UpdateRecurring))]
      public IActionResult UpdateRecurring([FromBody] RecurringIncomeDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var success = _recurringIncomeService.Update(model.Id, DateTime.Parse(model.Start), DateTime.Parse(model.End), model.Name, model.Amount, model.Notes, model.Recurrence);

            return Ok(new UpdateResultDto
            {
               Success = success,
               Error = success ? "" : "Invalid recurring income information"
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while updating");
         }
      }

      [HttpPost(nameof(DeleteRecurring))]
      public IActionResult DeleteRecurring([FromBody] IdDto deleteParameters)
      {
         try
         {
            if (deleteParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _recurringIncomeService.Delete(deleteParameters.Id);

            return Ok(new DeleteResultDto { Success = result });
         }
         catch (Exception)
         {
            return BadRequest("Error while deleting");
         }
      }

      #endregion Recurring
   }
}
