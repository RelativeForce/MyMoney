using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Core;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Interfaces.Service;
using MyMoney.Web.Models.Common;
using MyMoney.Web.Models.Entity;
using MyMoney.Web.Models.Request;
using MyMoney.Web.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MyMoney.Web.Controllers
{
   [ApiController]
   [Authorize]
   [Route("[controller]")]
   public class TransactionController : ControllerBase
   {
      private readonly ITransactionService _transactionService;

      public TransactionController(ITransactionService transactionService)
      {
         _transactionService = transactionService;
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

            var result = _transactionService.Add(DateTime.Parse(model.Date), model.Description, model.Amount, model.Notes, model.BudgetIds, model.IncomeIds);

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

            var transaction = _transactionService.Find(findParameters.Id);

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

      [HttpPost(nameof(List))]
      public IActionResult List([FromBody] DateRangeDto listParameters)
      {
         try
         {
            if (listParameters == null || !ModelState.IsValid)
            {
               return BadRequest("Invalid State");
            }

            var transactions = _transactionService.Between(listParameters.Start, listParameters.End);

            return Ok(new TransactionListDto
            {
               Transactions = transactions.Select(t => new TransactionDto(t)).ToList()
            });
         }
         catch (Exception)
         {
            return BadRequest("Error while creating");
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

            var success = _transactionService.Update(model.Id, DateTime.Parse(model.Date), model.Description, model.Amount, model.Notes, model.BudgetIds, model.IncomeIds);

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

            var result = _transactionService.Delete(deleteParameters.Id);

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

            var result = _transactionService.AddRecurring(DateTime.Parse(model.Start), DateTime.Parse(model.End), model.Description, model.Amount, model.Notes, model.Recurrence);

            if (result == null)
               return BadRequest("Invalid State");

            return Ok(new RecurringTransactionDto(result));
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

            var transaction = _transactionService.FindRecurring(findParameters.Id);

            if (transaction != null)
            {
               var children = _transactionService.GetChildTransactions(transaction);

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

            var success = _transactionService.UpdateRecurring(model.Id, DateTime.Parse(model.Start), DateTime.Parse(model.End), model.Description, model.Amount, model.Notes, model.Recurrence);

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

            var result = _transactionService.DeleteRecurring(deleteParameters.Id);

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
