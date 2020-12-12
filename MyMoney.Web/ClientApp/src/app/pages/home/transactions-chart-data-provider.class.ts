import { IChartDataProvider } from './chart/chart-data-provider.interface';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BudgetSeries, BudgetSeriesDataPoint } from 'src/app/shared/classes';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { BudgetService, TransactionService } from 'src/app/shared/services';
import { IAppState } from 'src/app/shared/state/app-state';
import { selectBudgets } from 'src/app/shared/state/selectors/budget.selector';
import { selectTransactions } from 'src/app/shared/state/selectors/transaction.selector';
import { IBudgetModel, IDateRangeModel, ITransactionModel } from 'src/app/shared/state/types';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { ISeries } from 'src/app/shared/interfaces/series.interface';

export class TransactionsChartDataProvider implements IChartDataProvider<Date> {
   public xAxisLabel: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public seriesData: Observable<ISeries[]>;
   public legendTitle: string;

   private seriesDataSubject: BehaviorSubject<ISeries[]>;
   private unsubscribe: Subject<void>;

   constructor(
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
      private readonly store: Store<IAppState>,
      private readonly router: Router,
   ) {
      this.seriesDataSubject = new BehaviorSubject<ISeries[]>([]);
      this.seriesData = this.seriesDataSubject.asObservable();
      this.unsubscribe = new Subject();

      this.xAxisLabel = 'Transactions';
      this.yAxisLabel = 'Remaining in budget (£)';
      this.colorScheme = {
         domain: ['#5AA454', '#783320', '#DB2E2E', '#7aa3e5', '#a8385d', '#aae3f5']
      };
      this.legendTitle = new Date().toLocaleString('default', { month: 'long' });
   }

   public init(): void {
      combineLatest([this.store.select(selectBudgets), this.store.select(selectTransactions)])
         .subscribe(([budgets, transactions]) => this.updateCharts(budgets, transactions));
   }

   public destroy(): void {
      this.unsubscribe.next();
      this.unsubscribe.complete();
   }

   public onSelect(data: ISeriesItem): void {
      this.router.navigate(['/transactions', 'edit', data.id]);
   }

   public search(now: Date): void {
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      this.budgetService.updateMonthId(month, year);
      this.transactionService.updateDateRange(this.defaultDateRange(now));
   }

   private defaultDateRange(now: Date): IDateRangeModel {
      const end: Date = new Date(now);
      end.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setHours(0, 0, 0, 0);

      const start: Date = new Date(now);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      return { end, start };
   }

   private updateCharts(budgets: IBudgetModel[], transactions: ITransactionModel[]): void {

      const seriesData = [];

      for (const budget of budgets) {
         const bs = new BudgetSeries(budget);

         for (const transaction of transactions) {
            bs.addTransaction(transaction);
         }

         seriesData[seriesData.length] = bs as ISeries;
      }

      this.seriesDataSubject.next(seriesData);
   }
}