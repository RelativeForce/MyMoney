import { ISeries, ISeriesDataPoint } from '@mymoney-common/interfaces';

export interface IChartDataProvider<
   TSeries extends ISeries<TDataPoint>,
   TDataPoint extends ISeriesDataPoint
> {
   chartTitle: string;
   yAxisLabel: string;
   colorScheme: { domain: string[] };
   series: TSeries[];
   subChartTitle: string;
   onSelect(data: TDataPoint): void;
   init(): void;
   destroy(): void;
   next(): void;
   previous(): void;
}
