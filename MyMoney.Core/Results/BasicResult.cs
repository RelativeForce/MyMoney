namespace MyMoney.Core.Results
{
   public class BasicResult
   {
      public bool Success { get; set; }
      public string Error { get; set; }

      private BasicResult()
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
