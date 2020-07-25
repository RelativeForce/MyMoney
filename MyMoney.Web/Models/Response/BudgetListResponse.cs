using System.Collections.Generic;
using MyMoney.Web.Models.Entity;

namespace MyMoney.Web.Models.Response
{
    public class BudgetListResponse
    {
        public List<BudgetModel> Budgets { get; set; } = new List<BudgetModel>();
    }
}
