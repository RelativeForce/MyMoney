using Moq;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Web.Utility;
using System;
using Xunit;

namespace MyMoney.Web.Tests.Utility
{
    public class TokenProviderTests
    {
        [Fact]
        public void ShouldTokeniseIdCorrectly()
        {
            const long Id = 5;

            var user = new Mock<IUser>(MockBehavior.Strict);

            user.Setup(m => m.Id).Returns(Id);

            var tokenProvider = new TokenProvider();

            var token = tokenProvider.NewToken(user.Object);

            var id = tokenProvider.GetUserId(token);

            Assert.Equal(Id, id);
        }
    }
}
