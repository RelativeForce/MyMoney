import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BudgetService, TransactionService } from 'src/app/shared/services';
import { IAppState } from 'src/app/shared/state/app-state';
import { IChartDataProvider } from './chart/chart-data-provider.interface';
import { TransactionsChartDataProvider } from './transactions-chart-data-provider.class';

@Component({
   templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
   public transactionsChart: IChartDataProvider<undefined>;

   constructor(
      transactionService: TransactionService,
      budgetService: BudgetService,
      store: Store<IAppState>,
      router: Router,
   ) {
      this.transactionsChart = new TransactionsChartDataProvider(transactionService, budgetService, router);
   }

   ngOnInit(): void {
      this.transactionsChart.init();
      this.transactionsChart.search(undefined);
   }

   ngOnDestroy(): void {
      this.transactionsChart.destroy();
   }
}
