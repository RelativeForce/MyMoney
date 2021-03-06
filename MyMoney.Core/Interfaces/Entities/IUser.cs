using MyMoney.Core.Data;
using MyMoney.Core.Interfaces.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MyMoney.Core.Interfaces.Entities
{
   public interface IUser : IBaseEntity
   {
      string Email { get; set; }
      string Password { get; set; }
      DateTime DateOfBirth { get; set; }
      string FullName { get; set; }
      IQueryable<IUserFeature> Features { get; }

      IEnumerable<string> ValidationErrors();
      void UpdateFeatures(FeatureFlags[] features);
   }
}
