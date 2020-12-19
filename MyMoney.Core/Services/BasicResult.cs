namespace MyMoney.Core.Services
{
   public class BasicResult
   {
      public bool Success { get; set; }
      public string Error { get; set; }

      protected BasicResult()
      {
         // Private constructor
      }

      public static BasicResult SuccessResult()
      { 
         return new BasicResult
         {
            Success = true,
            Error = null,
         };
      }

      public static BasicResult FailResult(string error)
      {
         return new BasicResult
         {
            Success = false,
            Error = error
         };
      }
   }
}
