using MyMoney.Web.Models.Entity;
using System.Collections.Generic;

namespace MyMoney.Web.Models.Response
{
   public class TransactionListDto
   {
      public List<TransactionDto> Transactions { get; set; } = new List<TransactionDto>();
   }
}
