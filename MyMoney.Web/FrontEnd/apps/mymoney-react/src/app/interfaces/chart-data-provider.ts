import { ISeries, ISeriesDataPoint } from "@mymoney-common/interfaces";

export type IColoredSeries = ISeries & { color: string };

export interface IChartDataProvider {
   chartTitle: string;
   data: IColoredSeries[];
   subChartTitle: string;
   yAxisLabel: string;
   onSelect(data: ISeriesDataPoint): void;
   next(): void;
   previous(): void;
}