using System;
using Moq;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Entities;
using MyMoney.Core.Services;
using Xunit;

namespace MyMoney.Core.Tests.Services
{
    public class TransactionServiceShould
    {
        private readonly Mock<IRepository> _repositoryMock;
        private readonly Mock<IEntityFactory> _entityFactoryMock;

        public TransactionServiceShould()
        {
            _repositoryMock = new Mock<IRepository>(MockBehavior.Strict);
            _entityFactoryMock = new Mock<IEntityFactory>(MockBehavior.Strict);
        }

        #region Register Tests

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("     ")]
        public void ShouldReturnNullOnAddTransactionWhenDescriptionIsInvalid(string invalidDescription)
        {
            var now = DateTime.Now;
            const decimal amount = 45;

            var mockUser = new Mock<IUser>(MockBehavior.Strict);

            _repositoryMock
                .Setup(m => m.Add(It.IsAny<ITransaction>()))
                .Returns((ITransaction) null)
                .Verifiable();

            _entityFactoryMock
                .Setup(m => m.NewTransaction)
                .Returns((ITransaction) null)
                .Verifiable();

            var service = NewService;

            var result = service.Add(mockUser.Object, now, invalidDescription, amount);

            Assert.Null(result);

            _repositoryMock.Verify(m => m.Add(It.IsAny<ITransaction>()), Times.Never);
            _entityFactoryMock.Verify(m => m.NewTransaction, Times.Never);
        }

        [Fact]
        public void ShouldAddTransactionWhenDataIsValid()
        {
            var now = DateTime.Now;
            const decimal amount = 45;
            const string description = "test description";
            const long userId = 7;
            const long transactionId = 44;

            var mockUser = new Mock<IUser>(MockBehavior.Strict);
            mockUser.Setup(m => m.Id).Returns(userId);

            var mockTransaction = new Mock<ITransaction>(MockBehavior.Strict);
            mockTransaction.SetupAllProperties();

            _repositoryMock
                .Setup(m => m.Add(It.Is<ITransaction>(t => 
                    t.UserId == userId &&
                    t.User.Equals(mockUser.Object) &&
                    t.Date.Equals(now) &&
                    t.Amount == amount &&
                    t.Description == description)))
                .Returns((ITransaction t) =>
                {
                    // Set the Id
                    t.Id = transactionId;

                    return t;
                })
                .Verifiable();

            _entityFactoryMock
                .Setup(m => m.NewTransaction)
                .Returns(mockTransaction.Object)
                .Verifiable();

            var service = NewService;

            var result = service.Add(mockUser.Object, now, description, amount);

            Assert.NotNull(result);
            Assert.Equal(now, result.Date);
            Assert.Equal(transactionId, result.Id);
            Assert.Equal(userId, result.UserId);
            Assert.Equal(description, result.Description);
            Assert.Equal(amount, result.Amount);
            Assert.Equal(mockUser.Object, result.User);
            
            _repositoryMock.Verify(m => m.Add(It.IsAny<ITransaction>()), Times.Once);
            _entityFactoryMock.Verify(m => m.NewTransaction, Times.Once);
        }

        #endregion

        #region Common

        private TransactionService NewService => new TransactionService(_repositoryMock.Object, _entityFactoryMock.Object);

        #endregion
    }
}
