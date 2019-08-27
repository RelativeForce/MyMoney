using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace MyMoney.API.Controllers
{
    public abstract class AuthorizedController : Controller
    {
        protected long CurrentUserId
        {
            get
            {
                var claim = User.Claims.First(c => c.Type.Equals(ClaimTypes.Name));

                return long.Parse(claim.Value);
            }
        }
    }
}
