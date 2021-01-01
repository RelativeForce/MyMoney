using System;

namespace MyMoney.Core.Data
{
   public class Token
   {
      public string JWT { get; }
      public DateTime ValidTo { get; }

      public Token(string jwt, DateTime validTo)
      {
         JWT = jwt;
         ValidTo = validTo;
      }
   }
}
