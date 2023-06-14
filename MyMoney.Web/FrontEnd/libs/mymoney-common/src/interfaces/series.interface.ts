import { ISeriesDataPoint } from './series-data-point.interface';

export interface ISeries {
   name: string;
   series: ISeriesDataPoint[];
}
