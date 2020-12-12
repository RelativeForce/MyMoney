import { IRunningTotalDto } from '../api';
import { ISeriesDataPoint } from '../interfaces/series-data-point.interface';

export class RunningTotalSeriesDataPoint implements ISeriesDataPoint {
   public readonly id: number;
   public readonly name: string;
   public readonly value: number;
   public readonly amount: number;
   public readonly date: string;

   constructor(runningTotal: IRunningTotalDto | null, initialTotal: number) {
      this.id = runningTotal?.id ?? -1;
      this.name = runningTotal?.text ?? 'Initial total';
      this.value = runningTotal?.value ?? initialTotal;
      this.amount = runningTotal?.delta ?? 0;
      this.date = runningTotal?.date ?? '';
   }
}
