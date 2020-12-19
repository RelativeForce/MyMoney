import { IChartDataProvider } from '../../shared/components/chart';
import { Router } from '@angular/router';
import { BudgetSeries } from 'src/app/shared/classes';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { BudgetService, TransactionService } from 'src/app/shared/services';
import { IBudgetModel, IDateRangeModel, ITransactionModel } from 'src/app/shared/state/types';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ISeries } from 'src/app/shared/interfaces/series.interface';

export class TransactionsChartDataProvider implements IChartDataProvider {
   public xAxisLabel: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public seriesData: Observable<ISeries[]>;
   public legendTitle: string;

   private seriesDataSubject: BehaviorSubject<ISeries[]>;

   constructor(
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
      private readonly router: Router,
   ) {
      this.seriesDataSubject = new BehaviorSubject<ISeries[]>([]);
      this.seriesData = this.seriesDataSubject.asObservable();

      this.xAxisLabel = 'Transactions';
      this.yAxisLabel = 'Remaining in budget (£)';
      this.colorScheme = {
         domain: ['#5AA454', '#783320', '#DB2E2E', '#7aa3e5', '#a8385d', '#aae3f5']
      };
      this.legendTitle = new Date().toLocaleString('default', { month: 'long' });
   }

   public init(): void {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      combineLatest([this.budgetService.getBudgetsForMonth(month, year), this.transactionService.getTransactionsInRange(this.defaultDateRange())])
         .subscribe(([budgetList, transactionList]) => this.updateChart(budgetList.budgets, transactionList.transactions.reverse()));
   }

   public destroy(): void {
      // Do nothing
   }

   public onSelect(item: ISeriesItem): void {
      this.router.navigate(item.link);
   }

   private defaultDateRange(): IDateRangeModel {
      const end: Date = new Date();
      end.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setHours(0, 0, 0, 0);

      const start: Date = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      return { end, start };
   }

   private updateChart(budgets: IBudgetModel[], transactions: ITransactionModel[]): void {

      const seriesData = [];

      for (const budget of budgets) {
         const bs = new BudgetSeries(budget);

         for (const transaction of transactions) {
            bs.addEntry(transaction);
         }

         seriesData[seriesData.length] = bs as ISeries;
      }

      this.seriesDataSubject.next(seriesData);
   }
}