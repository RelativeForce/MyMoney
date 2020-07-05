using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using MyMoney.Core;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure
{
    public sealed class CurrentUserProvider : ICurrentUserProvider
    {

        private readonly IRepository _repository;
        private readonly ITokenProvider _tokenProvider;

        public CurrentUserProvider(IRepository repository, ITokenProvider tokenProvider)
        {
            _repository = repository;
            _tokenProvider = tokenProvider;
        }

        public long CurrentUserId(string token)
        {
            return _tokenProvider.GetUserId(token) ?? throw new Exception("Cannot parse user id from token");
        }

        public IUser CurrentUser(string token)
        {
            var user = _repository.FindById<IUser>(CurrentUserId(token));

            if (user == null)
                throw new Exception("Current user does not exist");

            return user;
        }
    }
}
