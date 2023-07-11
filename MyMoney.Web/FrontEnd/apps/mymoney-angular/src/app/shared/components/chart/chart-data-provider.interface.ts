import { ISeries, ISeriesDataPoint } from '@mymoney-common/interfaces';
import { Observable } from 'rxjs';

export interface IChartDataProvider<TSeries extends ISeries<TDataPoint>, TDataPoint extends ISeriesDataPoint> {
   chartTitle: string;
   yAxisLabel: string;
   colorScheme: { domain: string[] };
   seriesData: Observable<TSeries[]>;
   subChartTitle: string;
   onSelect(data: TDataPoint): void;
   init(): void;
   destroy(): void;
   next(): void;
   previous(): void;
}
