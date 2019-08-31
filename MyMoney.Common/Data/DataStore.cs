using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MyMoney.Client.ApiExceptions;
using MyMoney.Client.Interfaces;
using MyMoney.Client.Models.Common;
using MyMoney.Client.Models.Entity;
using MyMoney.Client.Models.Request;

namespace MyMoney.Common.Data
{
    public class DataStore
    {
        private readonly IMyMoneyClientFactory _clientFactory;
        private readonly IAuthenticationManager _authenticationManager;
        private readonly IAlertDisplay _alertDisplay;
        private readonly List<TransactionModel> _transactionsCache;
        private readonly List<BudgetModel> _budgetsCache;

        public ObservableCollection<TransactionModel> Transactions { get; }
        public ObservableCollection<BudgetModel> Budgets { get; }

        public DataStore(IMyMoneyClientFactory clientFactory, IAuthenticationManager authenticationManager, IAlertDisplay alertDisplay)
        {
            _clientFactory = clientFactory;
            _authenticationManager = authenticationManager;
            _alertDisplay = alertDisplay;
            _transactionsCache = new List<TransactionModel>();
            _budgetsCache = new List<BudgetModel>();

            Transactions = new ObservableCollection<TransactionModel>();
            Budgets = new ObservableCollection<BudgetModel>();
        }

        public async Task ClearAndLoadTransactions(DateRangeModel dateRange)
        {
            using (var client = NewClient())
            {
                try
                {
                    if (! await Authenticate(client))
                        return;

                    var list = await client.TransactionApi.List(dateRange);

                    MergeContents(_transactionsCache, list.Transactions);
                    RefreshTransactionsList();
                }
                catch (Exception ex)
                {
                    await _alertDisplay.DisplayAlert("Transaction List Failed", "Server Error", "Close");
                }
            }
        }

        public async Task ClearAndLoadBudgets()
        {
            // TODO Populate budgets list
        }

        public async Task AddTransaction(TransactionModel model)
        {
            using (var client = NewClient())
            {
                try
                {
                    if (!await Authenticate(client))
                        return;

                    var newItem = await client.TransactionApi.Add(model);

                    var itemAfter = _transactionsCache.FirstOrDefault(t => t.Date < model.Date);

                    if (itemAfter != null)
                    {
                        _transactionsCache.Insert(_transactionsCache.IndexOf(itemAfter), newItem);
                    }
                    else
                    {
                        _transactionsCache.Add(newItem);
                    }

                    RefreshTransactionsList();
                }
                catch (Exception ex)
                {
                    await _alertDisplay.DisplayAlert("Add Transaction Failed", "Server Error", "Close");
                }
            }
        }

        public async Task DeleteTransaction(TransactionModel model)
        {
            using (var client = NewClient())
            {
                try
                {
                    if (!await Authenticate(client))
                        return;

                    var newItem = await client.TransactionApi.Delete(new DeleteRequest(model.Id));

                    if (newItem.Success)
                    {
                        _transactionsCache.Remove(model);
                        RefreshTransactionsList();
                    }
                    else
                    {
                        await _alertDisplay.DisplayAlert("Delete Transaction Failed", "Server Error", "Close");
                    }
                }
                catch (Exception ex)
                {
                    await _alertDisplay.DisplayAlert("Delete Transaction Failed", "Server Error", "Close");
                }
            }
        }

        public async Task UpdateTransaction(TransactionModel model)
        {
            using (var client = NewClient())
            {
                try
                {
                    if (!await Authenticate(client))
                        return;

                    var response = await client.TransactionApi.Update(model);

                    if (!response.Success)
                    {
                        await _alertDisplay.DisplayAlert("Update Transaction Failed", response.Error, "Close");
                    }
                    else
                    {
                        var transactionInList = _transactionsCache.First(t => t.Id == model.Id);

                        transactionInList.Update(model);

                        RefreshTransactionsList();
                    }
                }
                catch (MyMoneyApiException apiException)
                {
                    if (apiException.StatusCode == HttpStatusCode.NotFound)
                    {
                        await _alertDisplay.DisplayAlert("Update Transaction Failed", "Transaction does not exist on server", "Close");
                    }
                }
                catch (Exception)
                {
                    await _alertDisplay.DisplayAlert("Update Transaction Failed", "Server Error", "Close");
                }
            }
        }

        public async Task AddBudget(BudgetModel model)
        {
            using (var client = NewClient())
            {
                try
                {
                    if (!await Authenticate(client))
                        return;

                    var newBudget = await client.BudgetApi.Add(model);

                    var itemAfter = _budgetsCache.FirstOrDefault(t => t.Start >= newBudget.End);

                    if (itemAfter != null)
                    {
                        _budgetsCache.Insert(_budgetsCache.IndexOf(itemAfter), newBudget);
                    }
                    else
                    {
                        _budgetsCache.Add(newBudget);
                    }

                    RefreshBudgetsList();

                    await _alertDisplay.DisplayAlert("Add Budget Success", $"Budget {newBudget.Id}", "Close");
                }
                catch (Exception ex)
                {
                    await _alertDisplay.DisplayAlert("Add Budget Failed", "Server Error", "Close");
                }
            }
        }

        public void RefreshTransactionsList()
        {
            ReplaceContents(Transactions, _transactionsCache);
        }

        public void RefreshBudgetsList()
        {
            ReplaceContents(Budgets, _budgetsCache);
        }

        public async Task Register(RegisterRequest userDetails)
        {
            using (var client = NewClient())
            {
                try
                {
                    var response = await client.UserApi.Register(userDetails);

                    if (response.Success)
                    {
                        App.Login();
                    }
                    else
                    {
                        await _alertDisplay.DisplayAlert("Register Failed", response.Error, "Close");
                    }
                }
                catch (Exception ex)
                {
                    await _alertDisplay.DisplayAlert("Register Failed", "Server Error", "Close");
                }
            }
        }

        public async Task Login(LoginRequest loginModel)
        {
            using (var client = NewClient())
            {
                try
                {
                    var response = await client.UserApi.Login(loginModel);

                    if (response.Success)
                    {
                        App.Login();
                    }
                    else
                    {
                        await _alertDisplay.DisplayAlert("Login Failed", response.Error, "Close");
                    }
                }
                catch (Exception ex)
                {
                    await _alertDisplay.DisplayAlert("Login Failed", "Server Error", "Close");
                }
            }
        }

        private IMyMoneyClient NewClient()
        {
            return _clientFactory.NewClient(_authenticationManager);
        }

        private static void ReplaceContents<T>(ICollection<T> collection, ICollection<T> elements)
        {
            collection.Clear();

            foreach (var item in elements)
            {
                collection.Add(item);
            }
        }

        public static void MergeContents<T>(ICollection<T> collection, ICollection<T> elements) where T : EntityModel
        {
            foreach (var item in elements.Where(e => collection.All(el => e.Id != el.Id)))
            {
                collection.Add(item);
            }
        }

        private async Task<bool> Authenticate(IMyMoneyClient client)
        {
            var authenticate = await client.UserApi.Authenticate();

            if (authenticate)
                return true;

            await _alertDisplay.DisplayAlert("Authentication Failed", "Returning to login...", "Close");
            App.LogOut();

            return false;
        }
    }
}
