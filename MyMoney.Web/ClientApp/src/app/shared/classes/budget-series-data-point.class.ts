import { ISeriesDataPoint } from '../interfaces/series-data-point.interface';
import { ITransactionModel } from '../state/types';

export class BudgetSeriesDataPoint implements ISeriesDataPoint {
   public readonly id: number;
   public readonly name: string;
   public readonly value: number;
   public readonly amount: number;
   public readonly date: string;

   constructor(transaction: ITransactionModel | null, remaining: number) {
      this.id = transaction?.id ?? -1;
      this.name = transaction?.description ?? 'Initial budget';
      this.value = remaining;
      this.amount = transaction?.amount ?? remaining;
      this.date = transaction?.date ?? '';
   }
}
