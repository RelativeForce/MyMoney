import { IChartDataProvider } from '../../shared/components/chart';
import { Router } from '@angular/router';
import { HomeService } from '../../shared/services';
import { IDateRangeModel } from '../../shared/state/types';
import { IRunningTotalDto } from '@mymoney-common/api';
import { RunningTotalSeries, RunningTotalSeriesDataPoint } from '@mymoney-common/classes';

const LINE_COLOR = '#7aa3e5';

export class RunningTotalChartDataProvider implements IChartDataProvider<RunningTotalSeries, RunningTotalSeriesDataPoint> {
   public chartTitle: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public series: RunningTotalSeries[];
   public subChartTitle: string;

   private year: number;

   constructor(private readonly homeService: HomeService, private readonly router: Router) {
      this.series = [];
      this.subChartTitle = '';
      this.chartTitle = 'Total savings';
      this.yAxisLabel = 'Balance (£)';
      this.colorScheme = {
         domain: [LINE_COLOR],
      };
      this.year = new Date().getFullYear();
   }

   public init(): void {
      this.loadChartData();
   }

   public destroy(): void {
      // Do nothing
   }

   public onSelect(item: RunningTotalSeriesDataPoint): void {
      if (item.runningTotal !== null) {
         if (item.amount > 0) {
            if (item.runningTotal.parentId === null || item.id > 0) {
               this.router.navigate(['/incomes', 'edit', item.id]);
            } else {
               this.router.navigate(['/incomes', 'edit-recurring', item.runningTotal.parentId]);
            }
         } else if (item.amount < 0) {
            if (item.runningTotal.parentId === null || item.id > 0) {
               this.router.navigate(['/transactions', 'edit', item.id]);
            } else {
               this.router.navigate(['/transactions', 'edit-recurring', item.runningTotal.parentId]);
            }
         }
      }
   }

   public next(): void {
      this.year++;
      this.loadChartData();
   }

   public previous(): void {
      this.year--;
      this.loadChartData();
   }

   private get dateRange(): IDateRangeModel {
      const end: Date = new Date();
      end.setDate(1);
      end.setMonth(0);
      end.setFullYear(this.year + 1);
      end.setHours(0, 0, 0, 0);
      end.setDate(0); // Subtract 1 day

      const start: Date = new Date();
      start.setDate(1);
      start.setFullYear(this.year);
      start.setMonth(0);
      start.setHours(0, 0, 0, 0);

      return { end, start };
   }

   private loadChartData() {
      this.subChartTitle = `${this.year}`;
      this.homeService.getRunningTotal(0, this.dateRange).subscribe((runningTotalList) => this.updateChart(runningTotalList.runningTotals));
   }

   private updateChart(runningTotals: IRunningTotalDto[]): void {
      const series = new RunningTotalSeries(0, LINE_COLOR);

      for (const runningTotal of runningTotals) {
         series.addEntry(runningTotal);
      }

      this.series = [series];
   }
}
