import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BudgetSeries, BudgetSeriesDataPoint } from 'src/app/shared/classes';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { BudgetService, TransactionService } from 'src/app/shared/services';
import { IAppState } from 'src/app/shared/state/app-state';
import { selectBudgets } from 'src/app/shared/state/selectors/budget.selector';
import { selectTransactions } from 'src/app/shared/state/selectors/transaction.selector';
import { IBudgetModel, IDateRangeModel, ITransactionModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
   // options
   legend = true;
   showLabels = false;
   animations = true;
   xAxis = true;
   yAxis = true;
   showYAxisLabel = true;
   showXAxisLabel = true;
   xAxisLabel = 'Transactions';
   yAxisLabel = 'Remaining in budget (£)';
   timeline = true;

   colorScheme = {
      domain: ['#5AA454', '#783320', '#DB2E2E', '#7aa3e5', '#a8385d', '#aae3f5']
   };
   public xAxisTicks: BudgetSeriesDataPoint[];
   public seriesData: BudgetSeries[];
   public loading: boolean;
   private budgets: IBudgetModel[];
   private transactions: ITransactionModel[];

   constructor(
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
      private readonly store: Store<IAppState>,
      private readonly router: Router,
   ) {
      this.loading = false;
      this.budgets = [];
      this.transactions = [];
      this.seriesData = [];
      this.xAxisTicks = [];
   }
   ngOnInit(): void {
      this.store
         .select(selectBudgets)
         .subscribe((budgets) => {
            this.budgets = budgets;
            this.updateCharts();
         });

      this.store
         .select(selectTransactions)
         .subscribe((transactions) => {
            this.transactions = transactions.map(t => t).reverse();
            this.updateCharts();
         });

      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      this.budgetService.updateMonthId(month, year);
      this.transactionService.updateDateRange(this.defaultDateRange());
   }

   defaultDateRange(): IDateRangeModel {
      const end: Date = new Date();
      end.setDate(1);
      end.setMonth(end.getMonth() + 1);

      const start: Date = new Date();
      start.setDate(1);

      return { end, start };
   }

   updateCharts() {

      this.seriesData = this.budgets.map(b => new BudgetSeries(b));

      for (const transaction of this.transactions) {
         for (const budget of this.budgets) {
            this.seriesData.find(s => s.id === budget.id)?.addTransaction(transaction);
         }
      }
   }

   onSelect(data: ISeriesItem): void {
      this.router.navigate(['/transactions', 'edit', data.id]);
   }
}
