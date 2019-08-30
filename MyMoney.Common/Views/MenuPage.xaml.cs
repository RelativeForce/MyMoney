using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using MyMoney.Common.Models;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class MenuPage : ContentPage
    {
        MainPage RootPage => Application.Current.MainPage as MainPage;
        ObservableCollection<HomeMenuItem> menuItems;
        public MenuPage()
        {
            menuItems = new ObservableCollection<HomeMenuItem>();

            InitializeComponent();

            PopulateMenuItems();

            ListViewMenu.ItemsSource = menuItems;
            ListViewMenu.SelectedItem = menuItems[0];
            ListViewMenu.ItemSelected += async (sender, e) =>
            {
                if (e.SelectedItem == null)
                    return;

                var item = ((HomeMenuItem) e.SelectedItem).Item;
                await RootPage.NavigateFromMenu(item);
            };
        }

        public void PopulateMenuItems()
        {
            menuItems.Clear();

            if (App.AuthenticationManager.CurrentUser != null)
            {
                menuItems.Add(new HomeMenuItem(HomeMenuItems.Transactions));
                menuItems.Add(new HomeMenuItem(HomeMenuItems.Budget));
                menuItems.Add(new HomeMenuItem(HomeMenuItems.About));
                menuItems.Add(new HomeMenuItem(HomeMenuItems.Logout));
            }
            else
            {
                menuItems.Add(new HomeMenuItem(HomeMenuItems.Login));
                menuItems.Add(new HomeMenuItem(HomeMenuItems.Register));
                menuItems.Add(new HomeMenuItem(HomeMenuItems.About));
            }
        }
    }
}