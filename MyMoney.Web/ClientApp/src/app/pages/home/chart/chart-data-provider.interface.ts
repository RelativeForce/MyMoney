import { Observable } from 'rxjs';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { ISeries } from 'src/app/shared/interfaces/series.interface';

export interface IChartDataProvider<T> {
   xAxisLabel: string;
   yAxisLabel: string;
   colorScheme: { domain: string[] };
   seriesData: Observable<ISeries[]>;
   legendTitle: string;
   onSelect(data: ISeriesItem): void;
   init(): void;
   destroy(): void;
   search(searchParameters: T): void;
}