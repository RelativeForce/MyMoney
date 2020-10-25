namespace MyMoney.Web.Models.Entity
{
   public abstract class EntityModel
   {
      public long Id { get; set; }

      public EntityModel()
      {
         Id = 0;
      }

      public EntityModel(long id)
      {
         Id = id;
      }
   }
}
