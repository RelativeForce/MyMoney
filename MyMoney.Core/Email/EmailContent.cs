namespace MyMoney.Core.Email
{
   public class EmailContent
   {
      public bool IsHtml { get; set; } = true;
      public string Content { get; set; } = "";
      public string AttachFileName { get; set; } = "";
   }
}
