using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MyMoney.Common
{
    public interface IAlertDisplay
    {
        Task DisplayAlert(string title, string message, string cancel);
        Task DisplayAlert(string title, string message, string accept, string cancel);
    }
}
