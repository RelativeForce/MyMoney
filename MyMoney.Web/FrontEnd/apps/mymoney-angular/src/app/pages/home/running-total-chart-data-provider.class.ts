import { IChartDataProvider } from '../../shared/components/chart';
import { Router } from '@angular/router';
import { ISeriesItem, ISeries } from '@mymoney/common/interfaces';
import { HomeService } from '../../shared/services';
import { IDateRangeModel } from '../../shared/state/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRunningTotalDto } from '@mymoney/common/api';
import { RunningTotalSeries } from '@mymoney/common/classes';

export class RunningTotalChartDataProvider implements IChartDataProvider {
   public chartTitle: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public seriesData: Observable<ISeries[]>;
   public subChartTitle: string;

   private seriesDataSubject: BehaviorSubject<ISeries[]>;
   private year: number;

   constructor(
      private readonly homeService: HomeService,
      private readonly router: Router,
   ) {
      this.seriesDataSubject = new BehaviorSubject<ISeries[]>([]);
      this.seriesData = this.seriesDataSubject.asObservable();
      this.subChartTitle = '';
      this.chartTitle = 'Total savings';
      this.yAxisLabel = 'Balance (£)';
      this.colorScheme = {
         domain: ['#7aa3e5']
      };
      this.year = new Date().getFullYear();
   }

   public init(): void {
      this.loadChartData();
   }

   public destroy(): void {
      // Do nothing
   }

   public onSelect(item: ISeriesItem): void {
      this.router.navigate(item.link ?? ['./']);
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
      this.homeService
         .getRunningTotal(0, this.dateRange)
         .subscribe((runningTotalList) => this.updateChart(runningTotalList.runningTotals));
   }

   private updateChart(runningTotals: IRunningTotalDto[]): void {
      const series = new RunningTotalSeries(0);

      for (const runningTotal of runningTotals) {
         series.addEntry(runningTotal);
      }

      this.seriesDataSubject.next([series]);
   }
}
