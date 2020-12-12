import { ISeriesDataPoint } from './series-data-point.interface';

export interface ISeries {
   id: number;
   name: string;
   series: ISeriesDataPoint[];
}
