using System;
using System.Net;

namespace MyMoney.Client.ApiExceptions
{
    public sealed class MyMoneyApiException : Exception
    {
        public HttpStatusCode StatusCode { get; }

        public MyMoneyApiException(HttpStatusCode statusCode)
        {
            StatusCode = statusCode;
        }

        public MyMoneyApiException(HttpStatusCode statusCode, string message) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
