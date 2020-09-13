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
} from './pages';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      LoginComponent,
      RegisterComponent,
      AddTransactionsComponent,
      EditTransactionsComponent,
      TransactionsComponent,
      BudgetsComponent,
      AddBudgetsComponent,
      EditBudgetsComponent,
   ],
   imports: [
      BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forRoot([
         { path: 'login', component: LoginComponent },
         { path: 'register', component: RegisterComponent },
         {
            path: 'transactions',
            component: TransactionsComponent,
            pathMatch: 'full',
         },
         {
            path: 'transactions/add',
            component: AddTransactionsComponent,
            pathMatch: 'full',
         },
         {
            path: 'transactions/edit/:id',
            component: EditTransactionsComponent,
            pathMatch: 'full',
         },
         { path: 'budgets', component: BudgetsComponent, pathMatch: 'full' },
         {
            path: 'budgets/add',
            component: AddBudgetsComponent,
            pathMatch: 'full',
         },
         {
            path: 'budgets/edit/:id',
            component: EditBudgetsComponent,
            pathMatch: 'full',
         },
         { path: '', component: HomeComponent, pathMatch: 'full' },
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
