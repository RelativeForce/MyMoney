using System;

namespace MyMoney.Core.Services
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

        public static LoginResult SuccessResult(string token, DateTime tokenTimeOut)
        {
            return new LoginResult
            {
                Success = true,
                Token = token,
                Error = null,
                ValidTo = tokenTimeOut
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
