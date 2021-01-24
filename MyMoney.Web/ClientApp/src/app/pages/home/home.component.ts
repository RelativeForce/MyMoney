import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService, IncomeService, TransactionService } from 'src/app/shared/services';
import { IChartDataProvider } from '../../shared/components/chart';
import { RunningTotalChartDataProvider } from './running-total-chart-data-provider.class';
import { TransactionsChartDataProvider } from './transactions-chart-data-provider.class';

@Component({
   templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
   public transactionsChart: IChartDataProvider;
   public runningTotalChart: IChartDataProvider;

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
      this.runningTotalChart.init();
   }

   ngOnDestroy(): void {
      this.transactionsChart.destroy();
      this.runningTotalChart.destroy();
   }
}
