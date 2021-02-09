using System;
using System.Collections.Generic;
using System.Linq;
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
      private readonly Mock<ICurrentUserProvider> _currentUserProvider;
      private readonly Mock<IRelationRepository> _relationRepoMock;

      public TransactionServiceShould()
      {
         _repositoryMock = new Mock<IRepository>(MockBehavior.Strict);
         _entityFactoryMock = new Mock<IEntityFactory>(MockBehavior.Strict);
         _currentUserProvider = new Mock<ICurrentUserProvider>(MockBehavior.Strict);
         _relationRepoMock = new Mock<IRelationRepository>(MockBehavior.Strict);
      }

      #region Add Tests

      [Theory]
      [InlineData(null)]
      [InlineData("")]
      [InlineData("     ")]
      public void ShouldReturnNullOnAddTransactionWhenDescriptionIsInvalid(string invalidDescription)
      {
         var now = DateTime.Now;
         const decimal amount = 45;

         _repositoryMock
             .Setup(m => m.Add(It.IsAny<ITransaction>()))
             .Returns((ITransaction)null)
             .Verifiable();

         _entityFactoryMock
             .Setup(m => m.NewTransaction)
             .Returns((ITransaction)null)
             .Verifiable();

         var service = NewService;

         var result = service.Add(now, invalidDescription, amount, "", new long[0], new long[0]);

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

         _currentUserProvider
             .Setup(m => m.CurrentUser)
             .Returns(mockUser.Object)
             .Verifiable();

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

         _repositoryMock
            .Setup(m => m.UserFiltered<IBudget>(mockUser.Object))
            .Returns(new List<IBudget>().AsQueryable());

         _repositoryMock
            .Setup(m => m.UserFiltered<IIncome>(mockUser.Object))
            .Returns(new List<IIncome>().AsQueryable());

         _repositoryMock
             .Setup(m => m.Update(It.Is<ITransaction>(t =>
                 t.UserId == userId &&
                 t.User.Equals(mockUser.Object) &&
                 t.Date.Equals(now) &&
                 t.Amount == amount &&
                 t.Description == description)))
             .Returns((ITransaction t) => true)
             .Verifiable();

         _entityFactoryMock
             .Setup(m => m.NewTransaction)
             .Returns(mockTransaction.Object)
             .Verifiable();

         var service = NewService;

         var result = service.Add(now, description, amount, "", new long[0], new long[0]);

         Assert.NotNull(result);
         Assert.Equal(now, result.Date);
         Assert.Equal(transactionId, result.Id);
         Assert.Equal(userId, result.UserId);
         Assert.Equal(description, result.Description);
         Assert.Equal(amount, result.Amount);
         Assert.Equal(mockUser.Object, result.User);

         _repositoryMock.Verify(m => m.Add(It.IsAny<ITransaction>()), Times.Once);
         _entityFactoryMock.Verify(m => m.NewTransaction, Times.Once);
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
         var now = DateTime.Now;
         const decimal amount = 45;
         const long transactionId = 7;

         _repositoryMock
             .Setup(m => m.Update(It.IsAny<ITransaction>()))
             .Returns(false)
             .Verifiable();

         _repositoryMock
             .Setup(m => m.FindById<ITransaction>(transactionId))
             .Returns((ITransaction)null)
             .Verifiable();

         var service = NewService;

         var result = service.Update(transactionId, now, invalidDescription, amount, "", new long[0], new long[0]);

         Assert.False(result);

         _repositoryMock.Verify(m => m.Update(It.IsAny<ITransaction>()), Times.Never);
         _repositoryMock.Verify(m => m.FindById<ITransaction>(transactionId), Times.Never);
      }

      [Fact]
      public void ShouldReturnFalseOnUpdateTransactionWhenCurrentUserIsNotTransactionOwner()
      {
         var now = DateTime.Now;
         const decimal amount = 45;
         const long transactionId = 7;
         const long userId = 9;
         const string description = "test";

         var mockUser = new Mock<IUser>(MockBehavior.Strict);
         mockUser.Setup(m => m.Id).Returns(userId);

         _currentUserProvider
             .Setup(m => m.CurrentUser)
             .Returns(mockUser.Object)
             .Verifiable();

         var mockTransaction = new Mock<ITransaction>(MockBehavior.Strict);
         mockTransaction.Setup(m => m.Id).Returns(transactionId);
         mockTransaction.Setup(m => m.UserId).Returns(userId + 4);
         mockTransaction.SetupAllProperties();

         _repositoryMock
            .Setup(m => m.UserFiltered<IBudget>(mockUser.Object))
            .Returns(new List<IBudget>().AsQueryable());

         _repositoryMock
            .Setup(m => m.UserFiltered<IIncome>(mockUser.Object))
            .Returns(new List<IIncome>().AsQueryable());

         _repositoryMock
             .Setup(m => m.Update(It.IsAny<ITransaction>()))
             .Returns(false)
             .Verifiable();

         _currentUserProvider.Setup(m => m.CurrentUserId).Returns(userId).Verifiable();

         _repositoryMock
             .Setup(m => m.FindById<ITransaction>(transactionId))
             .Returns(mockTransaction.Object)
             .Verifiable();

         var service = NewService;

         var result = service.Update(transactionId, now, description, amount, "", new long[0], new long[0]);

         Assert.False(result);

         _repositoryMock.Verify(m => m.Update(It.IsAny<ITransaction>()), Times.Never);
         _repositoryMock.Verify(m => m.FindById<ITransaction>(transactionId), Times.Once);
      }

      [Fact]
      public void ShouldReturnFalseOnUpdateTransactionWhenTransactionDoesNotExist()
      {
         var now = DateTime.Now;
         const decimal amount = 45;
         const long transactionId = 7;
         const long userId = 9;
         const string description = "test";

         var mockUser = new Mock<IUser>(MockBehavior.Strict);
         mockUser.Setup(m => m.Id).Returns(userId);

         _currentUserProvider
             .Setup(m => m.CurrentUser)
             .Returns(mockUser.Object)
             .Verifiable();

         _repositoryMock
            .Setup(m => m.UserFiltered<IBudget>(mockUser.Object))
            .Returns(new List<IBudget>().AsQueryable());

         _repositoryMock
            .Setup(m => m.UserFiltered<IIncome>(mockUser.Object))
            .Returns(new List<IIncome>().AsQueryable());

         _repositoryMock
             .Setup(m => m.Update(It.IsAny<ITransaction>()))
             .Returns(false)
             .Verifiable();

         _currentUserProvider.Setup(m => m.CurrentUserId).Returns(userId).Verifiable();

         _repositoryMock
             .Setup(m => m.FindById<ITransaction>(transactionId))
             .Returns((ITransaction)null)
             .Verifiable();

         var service = NewService;

         var result = service.Update(transactionId, now, description, amount, "", new long[0], new long[0]);

         Assert.False(result);

         _repositoryMock.Verify(m => m.Update(It.IsAny<ITransaction>()), Times.Never);
         _repositoryMock.Verify(m => m.FindById<ITransaction>(transactionId), Times.Once);
      }

      [Theory]
      [InlineData(true)]
      [InlineData(false)]
      public void ShouldReturnExpectedResultOnUpdateTransactionWhenTransactionExistsAndIsValid(bool expectedResult)
      {
         var now = DateTime.Now;
         const decimal amount = 45;
         const long transactionId = 7;
         const long userId = 9;
         const string description = "test";

         var mockUser = new Mock<IUser>(MockBehavior.Strict);
         mockUser.Setup(m => m.Id).Returns(userId);

         _currentUserProvider
             .Setup(m => m.CurrentUser)
             .Returns(mockUser.Object)
             .Verifiable();

         var mockTransaction = new Mock<ITransaction>(MockBehavior.Strict);
         mockTransaction.SetupAllProperties();
         mockTransaction.Object.Id = transactionId;
         mockTransaction.Object.UserId = userId;

         _repositoryMock
            .Setup(m => m.UserFiltered<IBudget>(mockUser.Object))
            .Returns(new List<IBudget>().AsQueryable());

         _repositoryMock
            .Setup(m => m.UserFiltered<IIncome>(mockUser.Object))
            .Returns(new List<IIncome>().AsQueryable());

         _repositoryMock
             .Setup(m => m.Update(mockTransaction.Object))
             .Returns(expectedResult)
             .Verifiable();

         _currentUserProvider.Setup(m => m.CurrentUserId).Returns(userId).Verifiable();

         _repositoryMock
             .Setup(m => m.FindById<ITransaction>(transactionId))
             .Returns(mockTransaction.Object)
             .Verifiable();

         var service = NewService;

         var result = service.Update(transactionId, now, description, amount, "", new long[0], new long[0]);

         Assert.Equal(expectedResult, result);

         Assert.Equal(amount, mockTransaction.Object.Amount);
         Assert.Equal(description, mockTransaction.Object.Description);
         Assert.Equal(now, mockTransaction.Object.Date);

         _repositoryMock.Verify(m => m.Update(mockTransaction.Object), Times.Once);
         _repositoryMock.Verify(m => m.FindById<ITransaction>(transactionId), Times.Once);
      }

      #endregion

      #region Delete Tests

      [Fact]
      public void ShouldReturnFalseOnDeleteTransactionWhenIsNotOwnedByCurrentUser()
      {
         const long transactionId = 7;
         const long userId = 9;

         var mockTransaction = new Mock<ITransaction>(MockBehavior.Strict);
         mockTransaction.SetupAllProperties();
         mockTransaction.Object.Id = transactionId;
         mockTransaction.Object.UserId = userId + 5;

         _currentUserProvider.Setup(m => m.CurrentUserId).Returns(userId).Verifiable();

         _repositoryMock
             .Setup(m => m.FindById<ITransaction>(transactionId))
             .Returns(mockTransaction.Object)
             .Verifiable();

         var service = NewService;

         var result = service.Delete(transactionId);

         Assert.False(result);
         _repositoryMock.Verify(m => m.FindById<ITransaction>(transactionId), Times.Once);
      }

      [Fact]
      public void ShouldReturnFalseOnDeleteTransactionWhenTransactionDoesNotExist()
      {
         const long transactionId = 7;
         const long userId = 9;

         _currentUserProvider.Setup(m => m.CurrentUserId).Returns(userId).Verifiable();

         _repositoryMock
             .Setup(m => m.FindById<ITransaction>(transactionId))
             .Returns((ITransaction)null)
             .Verifiable();

         var service = NewService;

         var result = service.Delete(transactionId);

         Assert.False(result);

         _repositoryMock.Verify(m => m.FindById<ITransaction>(transactionId), Times.Once);
      }

      [Theory]
      [InlineData(true)]
      [InlineData(false)]
      public void ShouldReturnExpectedResultOnDeleteTransactionWhenTransactionExists(bool expectedResult)
      {
         const long transactionId = 7;
         const long userId = 9;

         var mockTransaction = new Mock<ITransaction>(MockBehavior.Strict);
         mockTransaction.SetupAllProperties();
         mockTransaction.Object.Id = transactionId;
         mockTransaction.Object.UserId = userId;

         _repositoryMock
             .Setup(m => m.Delete(mockTransaction.Object))
             .Returns(expectedResult)
             .Verifiable();

         _currentUserProvider.Setup(m => m.CurrentUserId).Returns(userId).Verifiable();

         _repositoryMock
             .Setup(m => m.FindById<ITransaction>(transactionId))
             .Returns(mockTransaction.Object)
             .Verifiable();

         var service = NewService;

         var result = service.Delete(transactionId);

         Assert.Equal(expectedResult, result);

         _repositoryMock.Verify(m => m.Delete(mockTransaction.Object), Times.Once);
         _repositoryMock.Verify(m => m.FindById<ITransaction>(transactionId), Times.Once);
      }

      #endregion

      #region Common

      private BasicTransactionService NewService => new BasicTransactionService(_repositoryMock.Object, _relationRepoMock.Object, _entityFactoryMock.Object, _currentUserProvider.Object);

      #endregion
   }
}
