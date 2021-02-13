import { IRunningTotalDto } from '../api';
import { ISeriesDataPoint } from '../interfaces/series-data-point.interface';

const DEFAULT_TEXT = 'Initial total';

export class RunningTotalSeriesDataPoint implements ISeriesDataPoint {
   public readonly name: string;
   public readonly text: string;
   public readonly id: number;
   public readonly value: number;
   public readonly amount: number;
   public readonly date: string;
   public readonly link: (string | number)[] | null;

   constructor(runningTotal: IRunningTotalDto | null, initialTotal: number) {
      this.id = runningTotal?.id ?? 0;
      this.text = runningTotal?.text ?? DEFAULT_TEXT;
      this.value = runningTotal?.value ?? initialTotal;
      this.amount = runningTotal?.delta ?? 0;
      this.date = runningTotal?.date ?? '';
      this.name = runningTotal?.name ?? DEFAULT_TEXT;
      this.link = null;

      if (this.amount > 0) {
         if (runningTotal.parentId === null || this.id > 0) {
            this.link = ['/incomes', 'edit', this.id];
         } else {
            this.link = ['/incomes', 'edit-recurring', runningTotal.parentId];
         }
      } else if (this.amount < 0) {
         if (runningTotal.parentId === null || this.id > 0) {
            this.link = ['/transactions', 'edit', this.id];
         } else {
            this.link = ['/transactions', 'edit-recurring', runningTotal.parentId];
         }
      }
   }
}
