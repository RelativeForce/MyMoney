import { IChartDataProvider } from './chart/chart-data-provider.interface';
import { Router } from '@angular/router';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { IncomeService } from 'src/app/shared/services';
import { IDateRangeModel } from 'src/app/shared/state/types';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ISeries } from 'src/app/shared/interfaces/series.interface';
import { IRunningTotalDto } from 'src/app/shared/api';
import { RunningTotalSeries } from 'src/app/shared/classes/running-total-series.class';

export class RunningTotalChartDataProvider implements IChartDataProvider {
   public xAxisLabel: string;
   public yAxisLabel: string;
   public colorScheme: { domain: string[] };
   public seriesData: Observable<ISeries[]>;
   public legendTitle: string;

   private seriesDataSubject: BehaviorSubject<ISeries[]>;

   constructor(
      private readonly budgetService: IncomeService,
      private readonly router: Router,
   ) {
      this.seriesDataSubject = new BehaviorSubject<ISeries[]>([]);
      this.seriesData = this.seriesDataSubject.asObservable();

      this.xAxisLabel = 'Total savings this year';
      this.yAxisLabel = 'Balance (£)';
      this.colorScheme = {
         domain: ['#7aa3e5']
      };
      this.legendTitle = '';
   }

   public init(): void {
      this.budgetService.getRunningTotal(0, this.defaultDateRange())
         .subscribe((runningTotalList) => this.updateChart(runningTotalList.runningTotals));
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
      end.setMonth(0);
      end.setFullYear(end.getFullYear() + 1);
      end.setHours(0, 0, 0, 0);

      const start: Date = new Date();
      start.setDate(1);
      start.setMonth(0);
      start.setHours(0, 0, 0, 0);

      return { end, start };
   }

   private updateChart(runningTotals: IRunningTotalDto[]): void {
      const series = new RunningTotalSeries(0);

      for (const runningTotal of runningTotals) {
         series.addEntry(runningTotal);
      }

      this.seriesDataSubject.next([series]);
   }
}