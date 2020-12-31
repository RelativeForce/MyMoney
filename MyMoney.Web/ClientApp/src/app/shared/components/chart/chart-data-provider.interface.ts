import { Observable } from 'rxjs';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { ISeries } from 'src/app/shared/interfaces/series.interface';

export interface IChartDataProvider {
   chartTitle: string;
   yAxisLabel: string;
   colorScheme: { domain: string[] };
   seriesData: Observable<ISeries[]>;
   subChartTitle: string;
   onSelect(data: ISeriesItem): void;
   init(): void;
   destroy(): void;
}
