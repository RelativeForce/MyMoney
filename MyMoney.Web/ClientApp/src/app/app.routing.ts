import { Routes } from '@angular/router';
import {
   AddBudgetsComponent,
   AddIncomesComponent,
   AddTransactionsComponent,
   BudgetsComponent,
   EditBudgetsComponent,
   EditIncomesComponent,
   EditTransactionsComponent,
   HomeComponent,
   ImportIncomesComponent,
   ImportTransactionsComponent,
   IncomesComponent,
   LoginComponent,
   RegisterComponent,
   TransactionsComponent
} from './pages';
import { LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from './shared/constants';
import { AuthenticationGuard } from './shared/guards/authenticated.guard';

export const routes: Routes = [
   {
      path: LOGIN_PAGE_PATH,
      component: LoginComponent,
      canActivate: [AuthenticationGuard]
   },
   {
      path: REGISTER_PAGE_PATH,
      component: RegisterComponent,
      canActivate: [AuthenticationGuard]
   },
   {
      path: '',
      component: HomeComponent,
      canActivate: [AuthenticationGuard]
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
      ]
   },
   // otherwise redirect to home
   { path: '**', redirectTo: '' }
];
