import { Routes } from '@angular/router';
import {
   AddBudgetsComponent,
   AddIncomesComponent,
   AddTransactionsComponent,
   BudgetsComponent,
   EditBudgetsComponent,
   EditIncomesComponent,
   EditTransactionsComponent,
   ForgotPasswordComponent,
   HomeComponent,
   ImportIncomesComponent,
   ImportTransactionsComponent,
   IncomesComponent,
   LoginComponent,
   RegisterComponent,
   ResetPasswordComponent,
   TransactionsComponent,
   UserComponent
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
            component: AddTransactionsComponent,
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
            component: EditTransactionsComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Edit transaction'
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
            component: AddBudgetsComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Add budget'
            },
         },
         {
            path: 'edit/:id',
            component: EditBudgetsComponent,
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
            component: AddIncomesComponent,
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
            component: EditIncomesComponent,
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
            path: '',
            component: UserComponent,
            canActivate: [AuthenticationGuard],
            data: {
               title: 'Profile'
            },
         },
         { path: '**', redirectTo: '/' }
      ]
   },
   { path: '**', redirectTo: '/' }
];
