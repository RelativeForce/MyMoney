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

        private readonly ICurrentUserProvider _currentUserProvider;
        private readonly ITransactionService _transactionService;

        public TransactionController(ICurrentUserProvider currentUserProvider, ITransactionService transactionService)
        {
            _currentUserProvider = currentUserProvider;
            _transactionService = transactionService;
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

                var transaction = _currentUserProvider.CurrentUser.Transactions.FirstOrDefault(t => t.Id == findParameters.Id);

                if(transaction != null)
                {
                    return Ok(new TransactionModel(transaction, useJavaScriptDate: true));
                }

                return NotFound("Transaction does not exist");
            }
            catch (Exception)
            {
                return BadRequest("Error while creating");
            }
        }

        [HttpPost(nameof(List))]
        public IActionResult List([FromBody] DateRangeModel listParameters)
        {
            try
            {
                if (listParameters == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var transactions = _currentUserProvider.CurrentUser.Between(listParameters.Start, listParameters.End);

                return Ok(new TransactionListResponse
                {
                    Transactions = transactions.Select(t => new TransactionModel(t)).ToList()
                });
            }
            catch (Exception)
            {
                return BadRequest("Error while creating");
            }
        }

        [HttpPost(nameof(Update))]
        public IActionResult Update([FromBody] TransactionModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var success = _transactionService.Update(model.Id, DateTime.Parse(model.Date), model.Description, model.Amount, model.BudgetIds);

                return Ok(new UpdateResponse
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

        [HttpPost(nameof(Add))]
        public IActionResult Add([FromBody] TransactionModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var result = _transactionService.Add(DateTime.Parse(model.Date), model.Description, model.Amount, model.BudgetIds);

                if (result == null)
                    return BadRequest("Invalid State");

                return Ok(new TransactionModel(result));
            }
            catch (Exception)
            {
                return BadRequest("Error while creating");
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

                var result = _transactionService.Delete(deleteParameters.Id);

                return Ok(new DeleteResponse { Success = result });
            }
            catch (Exception)
            {
                return BadRequest("Error while deleting");
            }
        }
    }
}
