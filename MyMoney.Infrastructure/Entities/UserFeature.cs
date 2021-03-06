using Microsoft.EntityFrameworkCore;
using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMoney.Infrastructure.Entities
{
   public class UserFeature : IUserFeature
   {
      public long UserId { get; set; }
      public FeatureFlags Feature { get; set; }
      [NotMapped]
      public IUser User
      {
         get => UserProxy;
         set => UserProxy = value as User;
      }

      [ForeignKey(nameof(UserId))]
      public virtual User UserProxy { get; set; }

      public UserFeature()
      {
         // Required by EF
      }

      public UserFeature(User user, FeatureFlags feature)
      {
         User = user;
         Feature = feature;
         UserId = user.Id;
      }

      internal static void Configure(ModelBuilder model)
      {
         model.Entity<UserFeature>().HasKey(uf => new { uf.UserId, uf.Feature });
      }
   }
}
