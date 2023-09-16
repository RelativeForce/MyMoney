using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using MyMoney.Application.Interfaces;
using MyMoney.Application.Services;
using MyMoney.Core.Interfaces;
using MyMoney.Infrastructure.Entities;
using Xunit;

namespace MyMoney.Application.Tests.Services
{
    public class TransactionServiceShould
    {
        private static DateTime Now { get; } = DateTime.Now;
        private const decimal Amount = 45;
        private const long TransactionId = 7;
        private const long UserId = 9;
        private const string Description = "test";
        private const string Notes = "test notes";

        private readonly Mock<IRepository> _repositoryMock;
        private readonly Mock<ICurrentUserProvider> _currentUserProvider;
        private readonly Mock<IRelationRepository> _relationRepoMock;

        private readonly BasicTransactionService _service;

        public TransactionServiceShould()
        {
            _repositoryMock = new Mock<IRepository>(MockBehavior.Strict);
            _currentUserProvider = new Mock<ICurrentUserProvider>(MockBehavior.Strict);
            _relationRepoMock = new Mock<IRelationRepository>(MockBehavior.Strict);

            _service = new BasicTransactionService(_repositoryMock.Object, _relationRepoMock.Object,
                _currentUserProvider.Object);
        }

        #region Add Tests

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("     ")]
        public void ShouldReturnNullOnAddTransactionWhenDescriptionIsInvalid(string invalidDescription)
        {
            _repositoryMock
                .Setup(m => m.Add(It.IsAny<Transaction>()))
                .Returns((Transaction)null)
                .Verifiable();


            var result = _service.Add(Now, invalidDescription, Amount, Notes, new long[0], new long[0]);

            Assert.Null(result);

            _repositoryMock.Verify(m => m.Add(It.IsAny<Transaction>()), Times.Never);
        }

        [Fact]
        public void ShouldAddTransactionWhenDataIsValid()
        {
            var mockUser = new User { Id = UserId };

            _currentUserProvider
                .Setup(m => m.CurrentUser)
                .Returns(mockUser)
                .Verifiable();

            var mockTransaction = new Transaction();

            _repositoryMock
                .Setup(m => m.Add(It.Is<Transaction>(t =>
                    t.UserId == UserId &&
                    t.User.Equals(mockUser) &&
                    t.Date.Equals(Now) &&
                    t.Amount == Amount &&
                    t.Description == Description &&
                    t.Notes == Notes &&
                    t.Parent == null &&
                    t.ParentId == null)))
                .Returns((Transaction t) =>
                {
                    // Set the Id
                    t.Id = TransactionId;

                    return t;
                })
                .Verifiable();

            _repositoryMock
                .Setup(m => m.UserFiltered<Budget>(UserId))
                .Returns(new List<Budget>().AsQueryable());

            _repositoryMock
                .Setup(m => m.UserFiltered<Income>(UserId))
                .Returns(new List<Income>().AsQueryable());

            _repositoryMock
                .Setup(m => m.Update(It.Is<Transaction>(t =>
                    t.UserId == UserId &&
                    t.User.Equals(mockUser) &&
                    t.Date.Equals(Now) &&
                    t.Amount == Amount &&
                    t.Description == Description &&
                    t.Notes == Notes &&
                    t.Parent == null &&
                    t.ParentId == null)))
                .Returns((Transaction t) => true)
                .Verifiable();

            var result = _service.Add(Now, Description, Amount, Notes, new long[0], new long[0]);

            Assert.NotNull(result);
            Assert.Equal(Now, result.Date);
            Assert.Equal(TransactionId, result.Id);
            Assert.Equal(UserId, result.UserId);
            Assert.Equal(Description, result.Description);
            Assert.Equal(Amount, result.Amount);
            Assert.Equal(mockUser, result.User);

            _repositoryMock.Verify(m => m.Add(It.IsAny<Transaction>()), Times.Once);
            _currentUserProvider.Verify(m => m.CurrentUser, Times.Once);
        }

        #endregion

        #region Update Tests

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("     ")]
        public void ShouldReturnFalseOnUpdateTransactionWhenDescriptionIsInvalid(string invalidDescription)
        {
            _repositoryMock
                .Setup(m => m.Update(It.IsAny<Transaction>()))
                .Returns(false)
                .Verifiable();

            _repositoryMock
                .Setup(m => m.UserFiltered<Transaction>(UserId))
                .Returns(new List<Transaction>().AsQueryable())
                .Verifiable();

            var result = _service.Update(TransactionId, Now, invalidDescription, Amount, Notes, new long[0],
                new long[0]);

            Assert.False(result);

            _repositoryMock.Verify(m => m.Update(It.IsAny<Transaction>()), Times.Never);
            _repositoryMock.Verify(m => m.UserFiltered<Transaction>(UserId), Times.Never);
        }

        [Fact]
        public void ShouldReturnFalseOnUpdateTransactionWhenTransactionDoesNotExist()
        {
            var mockUser = new User { Id = UserId };

            _currentUserProvider
                .Setup(m => m.CurrentUser)
                .Returns(mockUser)
                .Verifiable();

            _repositoryMock
                .Setup(m => m.UserFiltered<Budget>(UserId))
                .Returns(new List<Budget>().AsQueryable());

            _repositoryMock
                .Setup(m => m.UserFiltered<Income>(UserId))
                .Returns(new List<Income>().AsQueryable());

            _repositoryMock
                .Setup(m => m.Update(It.IsAny<Transaction>()))
                .Returns(false)
                .Verifiable();

            _currentUserProvider.Setup(m => m.CurrentUserId).Returns(UserId).Verifiable();

            _repositoryMock
                .Setup(m => m.UserFiltered<Transaction>(UserId))
                .Returns(new List<Transaction>().AsQueryable())
                .Verifiable();

            var result = _service.Update(TransactionId, Now, Description, Amount, Notes, new long[0], new long[0]);

            Assert.False(result);

            _repositoryMock.Verify(m => m.Update(It.IsAny<Transaction>()), Times.Never);
            _repositoryMock.Verify(m => m.UserFiltered<Transaction>(UserId), Times.Once);
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void ShouldReturnExpectedResultOnUpdateTransactionWhenTransactionExistsAndIsValid(bool expectedResult)
        {
            var mockUser = new User { Id = UserId };

            _currentUserProvider
                .Setup(m => m.CurrentUser)
                .Returns(mockUser)
                .Verifiable();

            var transaction = new Transaction
            {
                Id = TransactionId,
                UserId = UserId
            };

            _repositoryMock
                .Setup(m => m.UserFiltered<Budget>(UserId))
                .Returns(new List<Budget>().AsQueryable());

            _repositoryMock
                .Setup(m => m.UserFiltered<Income>(UserId))
                .Returns(new List<Income>().AsQueryable());

            _repositoryMock
                .Setup(m => m.Update(transaction))
                .Returns(expectedResult)
                .Verifiable();

            _currentUserProvider.Setup(m => m.CurrentUserId).Returns(UserId).Verifiable();

            _repositoryMock
                .Setup(m => m.UserFiltered<Transaction>(UserId))
                .Returns(new List<Transaction> { transaction }.AsQueryable())
                .Verifiable();

            var result = _service.Update(TransactionId, Now, Description, Amount, Notes, new long[0], new long[0]);

            Assert.Equal(expectedResult, result);

            Assert.Equal(Amount, transaction.Amount);
            Assert.Equal(Description, transaction.Description);
            Assert.Equal(Now, transaction.Date);

            _repositoryMock.Verify(m => m.Update(transaction), Times.Once);
            _repositoryMock.Verify(m => m.UserFiltered<Transaction>(UserId), Times.Once);
        }

        #endregion

        #region Delete Tests

        [Fact]
        public void ShouldReturnFalseOnDeleteTransactionWhenTransactionDoesNotExist()
        {
            _currentUserProvider.Setup(m => m.CurrentUserId).Returns(UserId).Verifiable();

            _repositoryMock
                .Setup(m => m.UserFiltered<Transaction>(UserId))
                .Returns(new List<Transaction>().AsQueryable())
                .Verifiable();

            var result = _service.Delete(TransactionId);

            Assert.False(result);

            _repositoryMock.Verify(m => m.UserFiltered<Transaction>(UserId), Times.Once);
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void ShouldReturnExpectedResultOnDeleteTransactionWhenTransactionExists(bool expectedResult)
        {
            var transaction = new Transaction
            {
                Id = TransactionId,
                UserId = UserId
            };

            _repositoryMock
                .Setup(m => m.Delete(transaction))
                .Returns(expectedResult)
                .Verifiable();

            _currentUserProvider.Setup(m => m.CurrentUserId).Returns(UserId).Verifiable();

            _repositoryMock
                .Setup(m => m.UserFiltered<Transaction>(UserId))
                .Returns(new List<Transaction> { transaction }.AsQueryable())
                .Verifiable();

            var result = _service.Delete(TransactionId);

            Assert.Equal(expectedResult, result);

            _repositoryMock.Verify(m => m.Delete(transaction), Times.Once);
            _repositoryMock.Verify(m => m.UserFiltered<Transaction>(UserId), Times.Once);
        }

        #endregion
    }
}