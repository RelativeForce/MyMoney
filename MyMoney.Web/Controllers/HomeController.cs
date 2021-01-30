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
   public class HomeController : ControllerBase
   {
      private readonly IRunningTotalService _runningTotalService;

      public HomeController(IRunningTotalService runningTotalService)
      {
         _runningTotalService = runningTotalService;
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
         catch (Exception e)
         {
            return BadRequest("Error while listing running total");
         }
      }
   }
}
