using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;

namespace MyMoney.Infrastructure.Entities
{
   public class UserFeature : IUserFeature
   {
      public long UserId { get; set; }
      public IUser User { get; set; }
      public FeatureFlags Feature { get; set; }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<UserFeature>().HasIndex(uf => new { uf.UserId, uf.Feature }).IsUnique();
      }
   }
}
