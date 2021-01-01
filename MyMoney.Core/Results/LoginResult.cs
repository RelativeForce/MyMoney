using MyMoney.Core.Data;
using System;

namespace MyMoney.Core.Results
{
   public class LoginResult
   {
      public bool Success { get; set; }
      public string Error { get; set; }
      public string Token { get; set; }
      public DateTime ValidTo { get; set; }

      private LoginResult()
      {
         // Private constructor
      }

      public static LoginResult SuccessResult(Token token)
      {
         return new LoginResult
         {
            Success = true,
            Token = token.JWT,
            Error = null,
            ValidTo = token.ValidTo
         };
      }

      public static LoginResult FailResult(string error)
      {
         return new LoginResult
         {
            Success = false,
            Token = null,
            Error = error,
            ValidTo = DateTime.UtcNow
         };
      }
   }
}
