import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import {
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  TransactionsComponent,
  AddTransactionComponent,
  BudgetsComponent,
  AddBudgetComponent,
  EditBasicTransactionComponent,
  EditBudgetComponent,
  IncomesComponent,
  EditBasicIncomeComponent,
  EditRecurringIncomeComponent,
  AddIncomeComponent,
  AddBasicIncomeComponent,
  AddRecurringIncomeComponent,
  ImportTransactionsComponent,
  ImportIncomesComponent,
  ProfileComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  ChangePasswordComponent,
  EditRecurringTransactionComponent,
  AddBasicTransactionComponent,
  AddRecurringTransactionComponent,
} from './pages';
import {
  BudgetSelectorComponent,
  ChartComponent,
  FooterComponent,
  ImportFileComponent,
  IncomeSelectorComponent,
  ToggleComponent,
  RecurringChildListComponent,
  BasicIncomeButtonsComponent,
  RecurringIncomeButtonsComponent,
  BasicTransactionButtonsComponent,
  RecurringTransactionButtonsComponent,
  BudgetButtonsComponent,
  CheckBoxComponent,
} from './shared/components';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './shared/state/app-state';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,

    // Pages
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AddTransactionComponent,
    EditBasicTransactionComponent,
    TransactionsComponent,
    BudgetsComponent,
    AddBudgetComponent,
    EditBudgetComponent,
    IncomesComponent,
    AddIncomeComponent,
    AddBasicIncomeComponent,
    AddRecurringIncomeComponent,
    EditBasicIncomeComponent,
    EditRecurringIncomeComponent,
    ImportTransactionsComponent,
    ImportIncomesComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    EditRecurringTransactionComponent,
    AddBasicTransactionComponent,
    AddRecurringTransactionComponent,

    // Shared
    ImportFileComponent,
    ChartComponent,
    FooterComponent,
    ToggleComponent,
    IncomeSelectorComponent,
    BudgetSelectorComponent,
    RecurringChildListComponent,
    BasicIncomeButtonsComponent,
    RecurringIncomeButtonsComponent,
    BasicTransactionButtonsComponent,
    RecurringTransactionButtonsComponent,
    BudgetButtonsComponent,
    CheckBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducer),
  ],
  providers: [Title],
  bootstrap: [AppComponent],
})
export class AppModule { }
