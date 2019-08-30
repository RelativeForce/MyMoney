namespace MyMoney.Common.Models
{
    public enum HomeMenuItems
    {
        Login = 0,
        Register = 1,
        Transactions = 2,
        About = 3,
        Logout = 4,
        Budget = 5,
    }

    public class HomeMenuItem
    {
        public HomeMenuItems Item { get; set; }
        public string Title { get; set; }

        public HomeMenuItem(HomeMenuItems item)
        {
            Item = item;
            Title = item.ToString().Replace('_', ' ');
        }
    }
}
