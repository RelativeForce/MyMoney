import { IChartDataProvider } from '../../shared/components/chart';
import { Router } from '@angular/router';
import { BudgetSeries, BudgetSeriesDataPoint } from '@mymoney-common/classes';
import { BudgetService, TransactionService } from '../../shared/services';
import {
   IBudgetModel,
   IDateRangeModel,
   ITransactionModel,
} from '../../shared/state/types';
import { combineLatest } from 'rxjs';
import { randomColor } from '@mymoney-common/functions';

export class TransactionsChartDataProvider
   implements IChartDataProvider<BudgetSeries, BudgetSeriesDataPoint>
{
   public chartTitle: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public series: BudgetSeries[];
   public subChartTitle: string;

   private month: Date;

   constructor(
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
      private readonly router: Router
   ) {
      this.series = [];
      this.subChartTitle = '';
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

   public onSelect(item: BudgetSeriesDataPoint): void {
      if (item.transaction === null) {
         return;
      }

      if (item.transaction.parentId === null || item.transaction.id > 0) {
         this.router.navigate(['/transactions', 'edit', item.transaction.id]);
      } else {
         this.router.navigate([
            '/transactions',
            'edit-recurring',
            item.transaction.parentId,
         ]);
      }
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
      end.setFullYear(this.month.getFullYear());
      end.setMonth(this.month.getMonth() + 1);
      end.setHours(0, 0, 0, 0);
      end.setDate(0); // Subtract 1 day

      const start: Date = new Date();
      start.setDate(1);
      start.setFullYear(this.month.getFullYear());
      start.setMonth(this.month.getMonth());
      start.setHours(0, 0, 0, 0);

      return { end, start };
   }

   private loadChartData(): void {
      this.subChartTitle = `${this.month.toLocaleString('default', {
         month: 'long',
      })} ${this.month.getFullYear()}`;

      const monthYear = this.monthYear;
      combineLatest([
         this.budgetService.getBudgetsForMonth(monthYear.month, monthYear.year),
         this.transactionService.getTransactionsInRange(this.dateRange),
      ]).subscribe(([budgetList, transactionList]) =>
         this.updateChart(
            budgetList.budgets,
            transactionList.transactions.reverse()
         )
      );
   }

   private updateChart(
      budgets: IBudgetModel[],
      transactions: ITransactionModel[]
   ): void {
      const seriesData = [];
      const colors = this.getColourScheme(budgets.length);

      for (let index = 0; index < budgets.length; index++) {
         const bs = new BudgetSeries(budgets[index], colors[index]);

         for (const transaction of transactions) {
            bs.addEntry(transaction);
         }

         seriesData[seriesData.length] = bs;
      }

      this.series = seriesData;
      this.colorScheme = { domain: colors };
   }

   private getColourScheme(budgetCount: number): string[] {
      const colors = [
         '#5AA454',
         '#783320',
         '#DB2E2E',
         '#7aa3e5',
         '#a8385d',
         '#aae3f5',
      ];

      if (budgetCount > colors.length) {
         const colorsToAdd = budgetCount - colors.length;

         for (let index = 0; index < colorsToAdd; index++) {
            colors.push(randomColor());
         }
      }

      return colors;
   }
}
