using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMoney.Client.Models.DTO;
using MyMoney.Client.Models.Request;
using MyMoney.Client.Models.Response;
using MyMoney.Core.Interfaces.Service;

namespace MyMoney.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TransactionController : AuthorizedController
    {

        private readonly IUserService _userService;
        private readonly ITransactionService _transactionService;

        public TransactionController(IUserService userService, ITransactionService transactionService)
        {
            _userService = userService;
            _transactionService = transactionService;
        }

        [HttpGet("list")]
        public IActionResult List([FromBody]TransactionListRequest listParameters)
        {
            try
            {
                if (listParameters == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var user = _userService.GetById(CurrentUserId);

                if(user == null)
                    return BadRequest("Error while retrieving user information");

                var transactions = user.Between(listParameters.Start, listParameters.End);

                return Ok(new TransactionListResponse
                {
                    Start = listParameters.Start,
                    End = listParameters.End,
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

        [HttpPost("add")]
        public IActionResult Add([FromBody]TransactionModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid State");
                }

                var user = _userService.GetById(CurrentUserId);

                if (user == null)
                    return BadRequest("Error while retrieving user information");

                var result = _transactionService.Add(user, model.Date, model.Description, model.Amount);

                if(result == null)
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
    }
}
