using MyMoney.Web.Models.Entity;
using System.Collections.Generic;

namespace MyMoney.Web.Models.Response
{
    public class BudgetListResponse
    {
        public List<BudgetModel> Budgets { get; set; } = new List<BudgetModel>();
    }
}
