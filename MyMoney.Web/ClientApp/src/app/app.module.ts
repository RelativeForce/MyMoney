import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './shared/api';
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
   ImportIncomesComponent,
   UserComponent,
   ForgotPasswordComponent,
   ResetPasswordComponent,
} from './pages';
import { ImportFileComponent } from './shared/components/import';
import { ChartComponent } from './shared/components/chart';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './shared/state/app-state';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routing';

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
      UserComponent,
      ForgotPasswordComponent,
      ResetPasswordComponent,

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
      RouterModule.forRoot(routes),
   ],
   providers: [
      {
         provide: HTTP_INTERCEPTORS,
         useClass: JwtInterceptor,
         multi: true
      },
      Title
   ],
   bootstrap: [AppComponent],
})
export class AppModule { }
