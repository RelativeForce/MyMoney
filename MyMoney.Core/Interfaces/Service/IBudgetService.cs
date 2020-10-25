﻿using System;
using System.Collections.Generic;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Core.Interfaces.Service
{
   public interface IBudgetService
   {
      IBudget Add(string monthId, string name, decimal amount, string notes);
      bool Delete(long budgetId);
      IBudget Find(long budgetId);
      List<IBudget> List(string monthId);
      bool Update(long budgetId, string monthId, string name, decimal amount, string notes);
   }
}
