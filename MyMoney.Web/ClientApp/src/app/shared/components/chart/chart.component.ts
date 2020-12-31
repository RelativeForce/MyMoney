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
   public showLegend = true;

   constructor() { }

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
