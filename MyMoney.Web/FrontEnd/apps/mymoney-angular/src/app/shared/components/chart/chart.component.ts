import { Component, Input } from '@angular/core';
import { IChartDataProvider } from './chart-data-provider.interface';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ISeries, ISeriesDataPoint } from '@mymoney-common/interfaces';

@Component({
   templateUrl: './chart.component.html',
   selector: 'mymoney-chart',
})
export class ChartComponent<TSeries extends ISeries<TDataPoint>, TDataPoint extends ISeriesDataPoint> {
   @Input()
   public dataProvider!: IChartDataProvider<TSeries, TDataPoint>;

   @Input()
   public showLegend = true;

   public LegendPosition = LegendPosition;

   public onSelect(item: TDataPoint): void {
      this.dataProvider.onSelect(item);
   }

   public onNext(): void {
      this.dataProvider.next();
   }

   public onPrevious(): void {
      this.dataProvider.previous();
   }

   public getXAxisTickLabel(val: string): string {
      return '';
   }
}
