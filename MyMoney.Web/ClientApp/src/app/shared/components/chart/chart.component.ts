import { Component, Input } from '@angular/core';
import { ISeriesItem } from 'src/app/shared/interfaces';
import { IChartDataProvider } from './chart-data-provider.interface';

@Component({
   templateUrl: './chart.component.html',
   selector: 'mymoney-chart'
})
export class ChartComponent {
   @Input()
   public dataProvider!: IChartDataProvider;

   @Input()
   public showLegend: boolean = true;

   constructor() { }

   public onSelect(item: ISeriesItem): void {
      this.dataProvider.onSelect(item);
   }

   public getXAxisTickLabel(val: string): string {
      return '';
   }
}
