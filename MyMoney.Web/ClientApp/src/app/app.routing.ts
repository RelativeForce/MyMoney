import { Routes } from '@angular/router';
import {
   AddBudgetComponent,
   AddIncomeComponent,
   AddTransactionComponent,
   BudgetsComponent,
   EditBudgetComponent,
   EditBasicIncomeComponent,
   EditBasicTransactionComponent,
   ForgotPasswordComponent,
   HomeComponent,
   ImportIncomesComponent,
   ImportTransactionsComponent,
   IncomesComponent,
   LoginComponent,
   RegisterComponent,
   ResetPasswordComponent,
   TransactionsComponent,
   ProfileComponent,
   ChangePasswordComponent,
   EditRecurringTransactionComponent
} from './pages';
import { AuthenticationGuard } from './shared/guards/authenticated.guard';

export const routes: Routes = [
   {
      path: '',
      component: HomeComponent,
      canActivate: [AuthenticationGuard]
   },
   {
      path: 'auth',
      children: [
         {
            path: 'login',
            component: LoginComponent,
            canActivate: [AuthenticationGuard],
            data: {
               isAnonymous: true,
               title: 'Login'
            }
         },
         {
            path: 'register',
            component: RegisterComponent,
            canActivate: [AuthenticationGuard],
            data: {
               isAnonymous: true,
               title: 'Register'
            }
         },
         {
            path: 'forgot-password',
            component: ForgotPasswordComponent,
            canActivate: [AuthenticationGuard],
            data: {
               isAnonymous: true,
               title: 'Forgot password'
            }
         },
         {
            path: 'reset-password/:token',
            component: ResetPasswordComponent,
            canActivate: [AuthenticationGuard],
            data: {
               isAnonymous: true,
               title: 'Reset password'
            }
         },
         { path: '**', redirectTo: '/' }
      ]
   },
   {
      path: 'transactions',
      children: [
         {
            path: '',
            component: TransactionsComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Transactions'
            },
         },
         {
            path: 'add',
            component: AddTransactionComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Add transaction'
            },
         },
         {
            path: 'import',
            component: ImportTransactionsComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Import transactions'
            },
         },
         {
            path: 'edit/:id',
            component: EditBasicTransactionComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Edit transaction'
            },
         },
         {
            path: 'edit-recurring/:id',
            component: EditRecurringTransactionComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Edit recurring transaction'
            },
         },
         { path: '**', redirectTo: '/' }
      ]
   },
   {
      path: 'budgets',
      children: [
         {
            path: '',
            component: BudgetsComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Budgets'
            },
         },
         {
            path: 'add',
            component: AddBudgetComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Add budget'
            },
         },
         {
            path: 'edit/:id',
            component: EditBudgetComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Edit budget'
            },
         },
         { path: '**', redirectTo: '/' }
      ]
   },
   {
      path: 'incomes',
      children: [
         {
            path: '',
            component: IncomesComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Incomes'
            },
         },
         {
            path: 'add',
            component: AddIncomeComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Add income'
            },
         },
         {
            path: 'import',
            component: ImportIncomesComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Import incomes'
            },
         },
         {
            path: 'edit/:id',
            component: EditBasicIncomeComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Edit income'
            },
         },
         { path: '**', redirectTo: '/' }
      ]
   },
   {
      path: 'user',
      children: [
         {
            path: 'profile',
            component: ProfileComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Profile'
            },
         },
         {
            path: 'change-password',
            component: ChangePasswordComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Change password'
            },
         },
         { path: '**', redirectTo: '/' }
      ]
   },
   { path: '**', redirectTo: '/' }
];
