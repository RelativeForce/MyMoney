using MyMoney.Core.Results;

namespace MyMoney.Web.Models.Response
{
   public class LoginResultDto
   {
      public bool Success { get; set; }
      public string Error { get; set; }
      public string Token { get; set; }
      public string ValidTo { get; set; }

      public LoginResultDto(LoginResult result)
      {
         Success = result.Success;
         Error = result.Error;
         Token = result.Token;
         ValidTo = result.ValidTo.ToString("yyyy-MM-dd") + "T" + result.ValidTo.ToString("HH:mm:ss");
      }
   }
}
