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
   public class TransactionController : ControllerBase
   {
      private readonly IBasicTransactionService _basicTransactionService;
      private readonly IRecurringTransactionService _recurringTransactionService;

      public TransactionController(IBasicTransactionService basicTransactionService, IRecurringTransactionService recurringTransactionService)
      {
         _basicTransactionService = basicTransactionService;
         _recurringTransactionService = recurringTransactionService;
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

            var basicTransactions = _basicTransactionService.Between(listParameters.Start, listParameters.End);
            var recurringTransactions = _recurringTransactionService.Between(listParameters.Start, listParameters.End);

            return Ok(new TransactionListDto
            {
               Transactions = basicTransactions
                  .Concat(recurringTransactions)
                  .OrderByDescending(t => t.Date)
                  .Select(t => new TransactionDto(t))
                  .ToList()
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
         }
      }

      #region Basic

      [HttpPost(nameof(Add))]
      public IActionResult Add([FromBody] TransactionDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _basicTransactionService.Add(DateTime.Parse(model.Date), model.Description, model.Amount, model.Notes, model.BudgetIds, model.IncomeIds);

            if (result == null)
               return BadRequest("Invalid State");

            return Ok(new TransactionDto(result));
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
         }
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

            var transaction = _basicTransactionService.Find(findParameters.Id);

            if (transaction != null)
            {
               return Ok(new TransactionDto(transaction));
            }

            return NotFound("Transaction does not exist");
         }
         catch (Exception)
         {
            return BadRequest("Error while searching");
         }
      }

      [HttpPost(nameof(Update))]
      public IActionResult Update([FromBody] TransactionDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var success = _basicTransactionService.Update(model.Id, DateTime.Parse(model.Date), model.Description, model.Amount, model.Notes, model.BudgetIds, model.IncomeIds);

            return Ok(new UpdateResultDto
            {
               Success = success,
               Error = success ? "" : "Invalid transaction information"
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

            var result = _basicTransactionService.Delete(deleteParameters.Id);

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
      public IActionResult AddRecurring([FromBody] RecurringTransactionDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var result = _recurringTransactionService.Add(DateTime.Parse(model.Start), DateTime.Parse(model.End), model.Description, model.Amount, model.Notes, model.Recurrence);

            if (result == null)
               return BadRequest("Invalid State");

            return Ok(new RecurringTransactionDto(result));
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

            var result = _recurringTransactionService.Realise(model.Id, DateTime.Parse(model.Date));

            if (result == null)
               return BadRequest("Invalid State");

            return Ok(new TransactionDto(result));
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

            var transaction = _recurringTransactionService.Find(findParameters.Id);

            if (transaction != null)
            {
               var children = transaction.Children();

               return Ok(new RecurringTransactionDto(transaction, children));
            }

            return NotFound("Recurriung transaction does not exist");
         }
         catch (Exception)
         {
            return BadRequest("Error while searching");
         }
      }

      [HttpPost(nameof(UpdateRecurring))]
      public IActionResult UpdateRecurring([FromBody] RecurringTransactionDto model)
      {
         try
         {
            if (model == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var success = _recurringTransactionService.Update(model.Id, DateTime.Parse(model.Start), DateTime.Parse(model.End), model.Description, model.Amount, model.Notes, model.Recurrence);

            return Ok(new UpdateResultDto
            {
               Success = success,
               Error = success ? "" : "Invalid recurring transaction information"
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

            var result = _recurringTransactionService.Delete(deleteParameters.Id);

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
