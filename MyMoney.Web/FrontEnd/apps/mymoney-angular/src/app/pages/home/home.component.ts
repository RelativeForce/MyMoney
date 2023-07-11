import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService, TransactionService } from '../../shared/services';
import { HomeService } from '../../shared/services/home.service';
import { RunningTotalChartDataProvider } from './running-total-chart-data-provider.class';
import { TransactionsChartDataProvider } from './transactions-chart-data-provider.class';

@Component({
   templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
   public transactionsChart: TransactionsChartDataProvider;
   public runningTotalChart: RunningTotalChartDataProvider;

   constructor(
      transactionService: TransactionService,
      budgetService: BudgetService,
      homeService: HomeService,
      router: Router
   ) {
      this.transactionsChart = new TransactionsChartDataProvider(
         transactionService,
         budgetService,
         router
      );
      this.runningTotalChart = new RunningTotalChartDataProvider(
         homeService,
         router
      );
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
