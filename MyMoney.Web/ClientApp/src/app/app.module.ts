import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { JwtInterceptor } from './shared/classes/jwt-interceptor.class';
import {
   HomeComponent,
   LoginComponent,
   RegisterComponent,
   TransactionsComponent,
   AddTransactionsComponent,
   BudgetsComponent,
   AddBudgetsComponent,
   EditTransactionsComponent,
   EditBudgetsComponent,
   IncomesComponent,
   EditIncomesComponent,
   AddIncomesComponent,
   ImportTransactionsComponent,
   ImportIncomesComponent
} from './pages';
import { ImportFileComponent } from './shared/components/import';
import { ChartComponent } from './shared/components/chart';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './shared/state/app-state';
import { AuthenticationGuard } from './shared/guards/authenticated.guard';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from './shared/constants';

@NgModule({
   declarations: [
      AppComponent,

      // Pages
      HomeComponent,
      LoginComponent,
      RegisterComponent,
      AddTransactionsComponent,
      EditTransactionsComponent,
      TransactionsComponent,
      BudgetsComponent,
      AddBudgetsComponent,
      EditBudgetsComponent,
      IncomesComponent,
      AddIncomesComponent,
      EditIncomesComponent,
      ImportTransactionsComponent,
      ImportIncomesComponent,

      // Shared
      ImportFileComponent,
      ChartComponent,
   ],
   imports: [
      BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      NgxChartsModule,
      ReactiveFormsModule,
      StoreModule.forRoot(appReducer),
      RouterModule.forRoot([
         {
            path: LOGIN_PAGE_PATH,
            component: LoginComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard]
         },
         {
            path: REGISTER_PAGE_PATH,
            component: RegisterComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard]
         },
         {
            path: 'transactions',
            component: TransactionsComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'transactions/add',
            component: AddTransactionsComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'transactions/import',
            component: ImportTransactionsComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'transactions/edit/:id',
            component: EditTransactionsComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'budgets',
            component: BudgetsComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'budgets/add',
            component: AddBudgetsComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'budgets/edit/:id',
            component: EditBudgetsComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: '', component: HomeComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard]
         },
         {
            path: 'incomes',
            component: IncomesComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'incomes/add',
            component: AddIncomesComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'incomes/import',
            component: ImportIncomesComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         {
            path: 'incomes/edit/:id',
            component: EditIncomesComponent,
            pathMatch: 'full',
            canActivate: [AuthenticationGuard],
         },
         // otherwise redirect to home
         { path: '**', redirectTo: '' },
      ]),
   ],
   providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   ],
   bootstrap: [AppComponent],
})
export class AppModule { }
