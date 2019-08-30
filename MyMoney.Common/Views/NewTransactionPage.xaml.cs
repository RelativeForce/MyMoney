﻿using System;
using System.ComponentModel;
using MyMoney.Client.Models.Entity;
using MyMoney.Common.Models;
using Xamarin.Forms;

namespace MyMoney.Common.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class NewTransactionPage : ContentPage
    {
        public TransactionModel Transaction { get; set; }
        public string MaxDate { get; set; }
        public string MinDate { get; set; }

        public NewTransactionPage()
        {
            InitializeComponent();

            Transaction = new TransactionModel
            {
                Amount = 0,
                Description = "",
                Date = DateTime.Now
            };

            MaxDate = DateTime.Now.AddMonths(36).ToShortDateString();
            MinDate = DateTime.Now.AddMonths(-36).ToShortDateString();

            BindingContext = this;
        }

        async void Save_Clicked(object sender, EventArgs e)
        {
            MessagingCenter.Send(this, "AddTransaction", Transaction);
            await Navigation.PopModalAsync();
        }

        void OnDateChanged(object sender, DateChangedEventArgs args)
        {
            Transaction.Date = args.NewDate;
        }

        async void Cancel_Clicked(object sender, EventArgs e)
        {
            await Navigation.PopModalAsync();
        }
    }
}