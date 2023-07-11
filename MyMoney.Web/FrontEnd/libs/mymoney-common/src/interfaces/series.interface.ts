import { ISeriesDataPoint } from './series-data-point.interface';

export interface ISeries<TDataPoint extends ISeriesDataPoint> {
   name: string;
   color: string;
   series: TDataPoint[];
}
