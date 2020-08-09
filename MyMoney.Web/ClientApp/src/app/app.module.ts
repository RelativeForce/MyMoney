import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { RegisterComponent } from './register/register.component';
import { AddTransactionsComponent } from './transactions/add/add.transactions.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { AddBudgetsComponent } from './budgets/add/add.budgets.component';
import { EditTransactionsComponent } from './transactions/edit/edit.transactions.component';
import { EditBudgetsComponent } from './budgets/edit/edit.budgets.component';

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
    EditBudgetsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([

      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'transactions', component: TransactionsComponent, pathMatch: 'full' },
      { path: 'transactions/add', component: AddTransactionsComponent, pathMatch: 'full' },
      { path: 'transactions/edit/:id', component: EditTransactionsComponent, pathMatch: 'full' },
      { path: 'budgets', component: BudgetsComponent, pathMatch: 'full' },
      { path: 'budgets/add', component: AddBudgetsComponent, pathMatch: 'full' },
      { path: 'budgets/edit/:id', component: EditBudgetsComponent, pathMatch: 'full' },
      { path: '', component: HomeComponent, pathMatch: 'full' },
      // otherwise redirect to home
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
