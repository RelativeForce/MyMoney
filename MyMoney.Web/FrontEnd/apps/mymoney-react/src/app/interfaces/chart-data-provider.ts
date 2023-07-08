import { ISeriesItem, ISeries } from '@mymoney-common/interfaces';

export interface IChartDataProvider {
   chartTitle: string;
   yAxisLabel: string;
   colorScheme: { domain: string[] };
   seriesData: ISeries[];
   subChartTitle: string;
   onSelect(data: ISeriesItem): void;
   init(): void;
   destroy(): void;
   next(): void;
   previous(): void;
}