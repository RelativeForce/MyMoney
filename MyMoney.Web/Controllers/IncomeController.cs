using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Core.Interfaces.Service;
using MyMoney.Web.Models.Common;
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
   public class IncomeController : ControllerBase
   {
      private readonly IIncomeService _basicIncomeService;
      private readonly IRunningTotalService _runningTotalService;
      private readonly IRecurringIncomeService _recurringIncomeService;

      public IncomeController(IIncomeService incomeService, IRunningTotalService runningTotalService, IRecurringIncomeService recurringIncomeService)
      {
         _basicIncomeService = incomeService;
         _runningTotalService = runningTotalService;
         _recurringIncomeService = recurringIncomeService;
      }

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

      [HttpPost(nameof(RunningTotal))]
      public IActionResult RunningTotal([FromBody] RunningTotalSearchDto dto)
      {
         try
         {
            if (dto == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var runningTotals = _runningTotalService.RunningTotal(dto.InitialTotal, dto.dateRange.Start, dto.dateRange.End);

            if (runningTotals == null)
               return NotFound();

            return Ok(new RunningTotalListDto
            {
               RunningTotals = runningTotals.Select(t => new RunningTotalDto(t)).ToList()
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while listing running total");
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
   }
}
