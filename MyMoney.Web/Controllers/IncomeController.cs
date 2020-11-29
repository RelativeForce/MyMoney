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
   public class IncomeController : ControllerBase
   {
      private readonly IIncomeService _incomeService;

      public IncomeController(IIncomeService incomeService)
      {
         _incomeService = incomeService;
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

            var income = _incomeService.Find(dto.Id);

            if (income != null)
            {
               return Ok(new IncomeDto(income));
            }

            return NotFound("Income does not exist");
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
         }
      }

      [HttpPost(nameof(List))]
      public IActionResult List([FromBody] IncomeSearchDto dto)
      {
         try
         {
            if (dto == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var incomes = _incomeService.From(dto.Date, dto.Count);

            if (incomes == null)
               return NotFound();

            return Ok(new IncomeListDto
            {
               Incomes = incomes.Select(t => new IncomeDto(t)).ToList()
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
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

            var result = _incomeService.Add(
                DateTime.Parse(dto.Date),
                dto.Name,
                dto.Amount
            );

            if (result == null)
               return BadRequest("Invalid income data");

            return Ok(new IncomeDto(result));

         }
         catch (Exception)
         {
            return BadRequest("Error while registering");
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

            var success = _incomeService.Update(dto.Id, DateTime.Parse(dto.Date), dto.Name, dto.Amount);

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

            var result = _incomeService.Delete(deleteParameters.Id);

            return Ok(new DeleteResultDto { Success = result });
         }
         catch (Exception)
         {
            return BadRequest("Error while deleting");
         }
      }
   }
}
