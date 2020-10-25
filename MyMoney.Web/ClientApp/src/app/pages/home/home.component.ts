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
   public xAxisLabel: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public xAxisTicks: BudgetSeriesDataPoint[];
   public seriesData: BudgetSeries[];
   public legendTitle: string;

   private budgets: IBudgetModel[];
   private transactions: ITransactionModel[];

   constructor(
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
      private readonly store: Store<IAppState>,
      private readonly router: Router,
   ) {
      this.budgets = [];
      this.transactions = [];
      this.seriesData = [];
      this.xAxisTicks = [];
      this.xAxisLabel = 'Transactions';
      this.yAxisLabel = 'Remaining in budget (£)';
      this.colorScheme = {
         domain: ['#5AA454', '#783320', '#DB2E2E', '#7aa3e5', '#a8385d', '#aae3f5']
      };
      this.legendTitle = new Date().toLocaleString('default', { month: 'long' });
   }

   ngOnInit(): void {

      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      this.budgetService.updateMonthId(month, year);

      this.store
         .select(selectBudgets)
         .subscribe((budgets) => {
            this.budgets = budgets;
            this.transactionService.updateDateRange(this.defaultDateRange());
         });

      this.store
         .select(selectTransactions)
         .subscribe((transactions) => {
            this.transactions = transactions.map(t => t).reverse();
            this.updateCharts();
         });
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

      this.seriesData = [];

      for (const budget of this.budgets) {
         const bs = new BudgetSeries(budget);

         for (const transaction of this.transactions) {
            bs.addTransaction(transaction);
         }

         this.seriesData[this.seriesData.length] = bs;
      }
   }

   onSelect(data: ISeriesItem): void {
      this.router.navigate(['/transactions', 'edit', data.id]);
   }
}
