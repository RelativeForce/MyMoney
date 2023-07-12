import { ISeries, ISeriesDataPoint } from '@mymoney-common/interfaces';

export interface IChartDataProvider<
   TSeries extends ISeries<TDataPoint>,
   TDataPoint extends ISeriesDataPoint
> {
   chartTitle: string;
   data: TSeries[];
   subChartTitle: string;
   yAxisLabel: string;
   onClickDataPoint(data: TDataPoint): void;
   onClickSeries(data: TSeries): void;
   next(): void;
   previous(): void;
}
