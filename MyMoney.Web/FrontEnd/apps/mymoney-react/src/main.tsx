import { StrictMode, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './app/globals.scss';
import { store } from './app/state/store';
import Layout from './app/components/layout';
import { Provider } from 'react-redux';
import Home from './app/pages/index';
import Login from './app/pages/auth/login';
import Register from './app/pages/auth/register';
import ForgotPassword from './app/pages/auth/forgot-password';
import ResetPassword from './app/pages/auth/reset-password';
import Budgets from './app/pages/budgets/index';
import AddBudget from './app/pages/budgets/add';
import EditBudget from './app/pages/budgets/edit';
import Transactions from './app/pages/transactions/index';
import AddTransaction from './app/pages/transactions/add';
import EditTransaction from './app/pages/transactions/edit';
import EditTransactionRecurring from './app/pages/transactions/edit-recurring';
import ImportTransactions from './app/pages/transactions/import';
import Incomes from './app/pages/incomes/index';
import AddIncome from './app/pages/incomes/add';
import EditIncome from './app/pages/incomes/edit';
import EditIncomeRecurring from './app/pages/incomes/edit-recurring';
import ImportIncomes from './app/pages/incomes/import';
import ChangePassword from './app/pages/user/change-password';
import Profile from './app/pages/user/profile';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="auth">
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<Navigate to="/auth/login" />} />
            </Route>
            <Route path="budgets">
              <Route index element={<Budgets />} />
              <Route path="add" element={<AddBudget />} />
              <Route path="edit" element={<EditBudget />} />
              <Route path="*" element={<Navigate to="/budgets" />} />
            </Route>
            <Route path="transactions">
              <Route index element={<Transactions />} />
              <Route path="add" element={<AddTransaction />} />
              <Route path="edit" element={<EditTransaction />} />
              <Route path="edit-recurring" element={<EditTransactionRecurring />} />
              <Route path="import" element={<ImportTransactions />} />
              <Route path="*" element={<Navigate to="/transactions" />} />
            </Route>
            <Route path="incomes">
              <Route index element={<Incomes />} />
              <Route path="add" element={<AddIncome />} />
              <Route path="edit" element={<EditIncome />} />
              <Route path="edit-recurring" element={<EditIncomeRecurring />} />
              <Route path="import" element={<ImportIncomes />} />
              <Route path="*" element={<Navigate to="/incomes" />} />
            </Route>
            <Route path="user">
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
