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

   constructor(runningTotal: IRunningTotalDto | null, initialTotal: number) {
      this.id = runningTotal?.id ?? -1;
      this.text = runningTotal?.text ?? DEFAULT_TEXT;
      this.value = runningTotal?.value ?? initialTotal;
      this.amount = runningTotal?.delta ?? 0;
      this.date = runningTotal?.date ?? '';

      if (runningTotal !== null) {

         if (runningTotal.isIncome) {
            this.name = `Income ${runningTotal.id}`;
         }

         if (runningTotal.isTransaction) {
            this.name = `Transaction ${runningTotal.id}`;
         }

      } else {
         this.name = DEFAULT_TEXT;
      }
   }
}
