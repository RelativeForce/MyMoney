﻿using MyMoney.Core.Interfaces.Entities.Abstract;
using System;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IIncome : IUserFilteredEntity
   {
      DateTime Date { get; set; }
      string Name { get; set; }
      decimal Amount { get; set; }
      string Notes { get; set; }

      IQueryable<ITransaction> Transactions { get; }
      void DeleteRelations(IRelationRepository relationRepository);
   }
}
