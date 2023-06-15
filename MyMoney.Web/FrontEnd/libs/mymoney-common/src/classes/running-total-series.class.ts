import { IRunningTotalDto } from '../api/dtos';
import { ISeries } from '../interfaces/series.interface';
import { RunningTotalSeriesDataPoint } from './running-total-series-data-point.class';

export class RunningTotalSeries implements ISeries {
   public name: string;
   public series: RunningTotalSeriesDataPoint[];

   private initialTotal: number;

   constructor(initialTotal: number) {
      this.name = 'Running total';
      this.initialTotal = initialTotal;
      this.series = [new RunningTotalSeriesDataPoint(null, initialTotal)];
   }

   public addEntry(entry: IRunningTotalDto) {
      this.series[this.series.length] = new RunningTotalSeriesDataPoint(
         entry,
         this.initialTotal
      );
   }
}
