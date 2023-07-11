import { IRunningTotalDto } from '../api/dtos';
import { ISeriesDataPoint } from '../interfaces/series-data-point.interface';

const DEFAULT_TEXT = 'Initial total';

export class RunningTotalSeriesDataPoint implements ISeriesDataPoint {
   public readonly name: string;
   public readonly text: string;
   public readonly id: number;
   public readonly value: number;
   public readonly amount: number;
   public readonly date: string;

   constructor(
      public readonly runningTotal: IRunningTotalDto | null,
      initialTotal: number
   ) {
      this.id = runningTotal?.id ?? 0;
      this.text = runningTotal?.text ?? DEFAULT_TEXT;
      this.value = runningTotal?.value ?? initialTotal;
      this.amount = runningTotal?.delta ?? 0;
      this.date = runningTotal?.date ?? '';
      this.name = runningTotal?.name ?? DEFAULT_TEXT;
   }
}
