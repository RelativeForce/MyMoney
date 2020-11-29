namespace MyMoney.Web.Models.Entity
{
   public abstract class EntityDto
   {
      public long Id { get; set; }

      public EntityDto()
      {
         Id = 0;
      }

      public EntityDto(long id)
      {
         Id = id;
      }
   }
}
