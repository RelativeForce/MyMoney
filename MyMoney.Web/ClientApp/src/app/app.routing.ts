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
            canActivate: [AuthenticationGuard]
         },
         {
            path: 'register',
            component: RegisterComponent,
            canActivate: [AuthenticationGuard]
         },
         {
            path: 'forgot-password',
            component: ForgotPasswordComponent,
            canActivate: [AuthenticationGuard]
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
         },
         {
            path: 'add',
            component: AddTransactionsComponent,
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'import',
            component: ImportTransactionsComponent,
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'edit/:id',
            component: EditTransactionsComponent,
            canActivate: [AuthenticationGuard],
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
         },
         {
            path: 'add',
            component: AddBudgetsComponent,
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'edit/:id',
            component: EditBudgetsComponent,
            canActivate: [AuthenticationGuard],
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
         },
         {
            path: 'add',
            component: AddIncomesComponent,
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'import',
            component: ImportIncomesComponent,
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'edit/:id',
            component: EditIncomesComponent,
            canActivate: [AuthenticationGuard],
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
         },
         { path: '**', redirectTo: '/' }
      ]
   },
   { path: '**', redirectTo: '/' }
];
