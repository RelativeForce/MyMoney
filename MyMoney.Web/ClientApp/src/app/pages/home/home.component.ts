import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService, IncomeService, TransactionService } from 'src/app/shared/services';
import { IChartDataProvider } from './chart/chart-data-provider.interface';
import { RunningTotalChartDataProvider } from './running-total-chart-data-provider.class';
import { TransactionsChartDataProvider } from './transactions-chart-data-provider.class';

@Component({
   templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
   public transactionsChart: IChartDataProvider<undefined>;
   public runningTotalChart: IChartDataProvider<undefined>;

   constructor(
      transactionService: TransactionService,
      budgetService: BudgetService,
      incomeService: IncomeService,
      router: Router,
   ) {
      this.transactionsChart = new TransactionsChartDataProvider(transactionService, budgetService, router);
      this.runningTotalChart = new RunningTotalChartDataProvider(incomeService, router);
   }

   ngOnInit(): void {
      this.transactionsChart.init();
      this.transactionsChart.search(undefined);

      this.runningTotalChart.init();
      this.runningTotalChart.search(undefined)
   }

   ngOnDestroy(): void {
      this.transactionsChart.destroy();
      this.runningTotalChart.destroy()
   }
}
