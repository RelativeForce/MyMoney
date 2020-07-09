﻿using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Web.Models.Common;
using MyMoney.Web.Models.Entity;
using MyMoney.Web.Models.Request;
using MyMoney.Web.Models.Response;
using MyMoney.Core;
using MyMoney.Core.Interfaces.Service;

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
                    DateRange = new DateRangeModel
                    {
                        Start = listParameters.Start,
                        End = listParameters.End
                    },
                    Transactions = transactions.Select(t => new TransactionModel
                    {
                        Id = t.Id,
                        Date = t.Date,
                        Description = t.Description,
                        Amount = t.Amount,
                    }).ToList()
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

                var success = _transactionService.Update(model.Id, model.Date, model.Description, model.Amount);

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

                var result = _transactionService.Add(model.Date, model.Description, model.Amount);

                if (result == null)
                    return BadRequest("Invalid State");

                return Ok(new TransactionModel
                {
                    Id = result.Id,
                    Amount = result.Amount,
                    Date = result.Date,
                    Description = result.Description
                });
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