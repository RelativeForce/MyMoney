import { ISeries, ISeriesDataPoint } from '@mymoney-common/interfaces';
import { IChartNavigationButton } from './chart-navigation-button';

export interface IChartDataProvider<
   TSeries extends ISeries<TDataPoint>,
   TDataPoint extends ISeriesDataPoint
> {
   chartTitle: string;
   data: TSeries[];
   yAxisLabel: string;
   onClickDataPoint(data: TDataPoint): void;
   onClickSeries(data: TSeries): void;
   leftButtons: IChartNavigationButton[];
   rightButtons: IChartNavigationButton[];
}
