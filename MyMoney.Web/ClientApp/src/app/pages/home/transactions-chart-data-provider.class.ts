import { IChartDataProvider } from '../../shared/components/chart';
import { Router } from '@angular/router';
import { BudgetSeries } from 'src/app/shared/classes';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { BudgetService, TransactionService } from 'src/app/shared/services';
import { IBudgetModel, IDateRangeModel, ITransactionModel } from 'src/app/shared/state/types';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ISeries } from 'src/app/shared/interfaces/series.interface';
import { randomColor } from 'src/app/shared/functions';

export class TransactionsChartDataProvider implements IChartDataProvider {
   public chartTitle: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public seriesData: Observable<ISeries[]>;
   public subChartTitle: string;

   private seriesDataSubject: BehaviorSubject<ISeries[]>;
   private month: Date;

   constructor(
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
      private readonly router: Router,
   ) {
      this.seriesDataSubject = new BehaviorSubject<ISeries[]>([]);
      this.seriesData = this.seriesDataSubject.asObservable();

      this.chartTitle = 'Transactions';
      this.yAxisLabel = 'Remaining in budget (£)';
      this.colorScheme = { domain: [] };
      this.month = new Date();
      this.month.setDate(1);
   }

   public init(): void {
      this.loadChartData();
   }

   public destroy(): void {
      // Do nothing
   }

   public onSelect(item: ISeriesItem): void {
      this.router.navigate(item.link);
   }

   public next(): void {
      this.month.setMonth(this.month.getMonth() + 1);
      this.loadChartData();
   }

   public previous(): void {
      this.month.setMonth(this.month.getMonth() - 1);
      this.loadChartData();
   }

   private get monthYear(): { month: number; year: number } {
      const month = this.month.getMonth() + 1;
      const year = this.month.getFullYear();

      return { month, year };
   }

   private get dateRange(): IDateRangeModel {

      const end: Date = new Date();
      end.setDate(1);
      end.setMonth(this.month.getMonth() + 1);
      end.setHours(0, 0, 0, 0);

      const start: Date = new Date();
      start.setDate(1);
      start.setMonth(this.month.getMonth());
      start.setHours(0, 0, 0, 0);

      return { end, start };
   }

   private loadChartData(): void {
      this.subChartTitle = this.month.toLocaleString('default', { month: 'long' });

      const monthYear = this.monthYear;
      combineLatest([
         this.budgetService.getBudgetsForMonth(monthYear.month, monthYear.year),
         this.transactionService.getTransactionsInRange(this.dateRange)
      ]).subscribe(([budgetList, transactionList]) => this.updateChart(budgetList.budgets, transactionList.transactions.reverse()));
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

      this.updateColourScheme(budgets.length);

      this.seriesDataSubject.next(seriesData);
   }

   private updateColourScheme(budgetCount: number) {

      const colors = ['#5AA454', '#783320', '#DB2E2E', '#7aa3e5', '#a8385d', '#aae3f5'];

      if (budgetCount > colors.length) {
         const colorsToAdd = budgetCount - colors.length;

         for (let index = 0; index < colorsToAdd; index++) {
            colors.push(randomColor());
         }
      }

      this.colorScheme = { domain: colors };
   }
}
