namespace MyMoney.Core.Services
{
    public class LoginResult
    {
        public bool Success { get; set; }
        public string Error { get; set; }
        public string Token { get; set; }

        private LoginResult()
        {
            // Private constructor
        }

        public static LoginResult SuccessResult(string token)
        {
            return new LoginResult
            {
                Success = true,
                Token = token,
                Error = null
            };
        }

        public static LoginResult FailResult(string error)
        {
            return new LoginResult
            {
                Success = false,
                Token = null,
                Error = error
            };
        }
    }
}
