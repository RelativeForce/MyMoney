using MyMoney.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MyMoney.Web.Utility
{
   public class ResourceManager : IResourceManager
   {
      public string Load(string resourceFileName)
      {
         return File.ReadAllText(Path.Combine(Directory.GetCurrentDirectory(), "Resources", resourceFileName));
      }
   }
}
