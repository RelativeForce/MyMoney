import { Component, Input } from '@angular/core';
import { ISeriesItem } from '@mymoney/common';
import { IChartDataProvider } from './chart-data-provider.interface';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
   templateUrl: './chart.component.html',
   selector: 'mymoney-chart'
})
export class ChartComponent {
   @Input()
   public dataProvider!: IChartDataProvider;

   @Input()
   public showLegend = true;

   public LegendPosition = LegendPosition;

   public onSelect(item: ISeriesItem): void {
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
