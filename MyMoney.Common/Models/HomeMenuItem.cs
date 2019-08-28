namespace MyMoney.Common.Models
{
    public enum HomeMenuItems
    {
        Login = 0,
        Register = 1,
        Transactions = 2,
        About = 3,
    }

    public class HomeMenuItem
    {
        public int Id { get; set; }
        public HomeMenuItems Item { get; set; }
        public string Title { get; set; }

        public HomeMenuItem(HomeMenuItems item)
        {
            Id = (int) item;
            Item = item;
            Title = item.ToString();
        }
    }
}
