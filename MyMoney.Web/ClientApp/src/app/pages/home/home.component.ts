import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureFlags } from 'src/app/shared/api';
import { BudgetService, CurrentUserService, TransactionService } from 'src/app/shared/services';
import { HomeService } from 'src/app/shared/services/home.service';
import { IChartDataProvider } from '../../shared/components/chart';
import { RunningTotalChartDataProvider } from './running-total-chart-data-provider.class';
import { TransactionsChartDataProvider } from './transactions-chart-data-provider.class';

@Component({
   templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
   public transactionsChart: IChartDataProvider;
   public runningTotalChart: IChartDataProvider;
   public showBudgets: boolean;

   constructor(
      private readonly currentUserService: CurrentUserService,
      transactionService: TransactionService,
      budgetService: BudgetService,
      homeService: HomeService,
      router: Router,
   ) {
      this.transactionsChart = new TransactionsChartDataProvider(transactionService, budgetService, router);
      this.runningTotalChart = new RunningTotalChartDataProvider(homeService, router);
      this.showBudgets = false;
   }

   ngOnInit(): void {
      this.transactionsChart.init();
      this.runningTotalChart.init();
      this.currentUserService
         .hasFeature(FeatureFlags.budgets)
         .subscribe((showBudgets) => this.showBudgets = showBudgets);
   }

   ngOnDestroy(): void {
      this.transactionsChart.destroy();
      this.runningTotalChart.destroy();
   }
}
