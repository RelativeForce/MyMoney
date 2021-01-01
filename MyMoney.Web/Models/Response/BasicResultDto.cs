using MyMoney.Core.Results;

namespace MyMoney.Web.Models.Response
{
   public class BasicResultDto
   {
      public bool Success { get; set; }
      public string Error { get; set; }

      public BasicResultDto(BasicResult result)
      {
         Success = result.Success;
         Error = result.Error;
      }
   }
}
