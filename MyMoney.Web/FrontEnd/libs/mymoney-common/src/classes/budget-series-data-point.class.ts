import { ISeriesDataPoint } from '../interfaces/series-data-point.interface';
import { ITransactionDto } from '../api/dtos';

const DEFAULT_TEXT = 'Initial budget';

export class BudgetSeriesDataPoint implements ISeriesDataPoint {
   public readonly id: number;
   public readonly name: string;
   public readonly text: string;
   public readonly value: number;
   public readonly amount: number;
   public readonly date: string;
   public readonly link: (string | number)[] | null;

   constructor(transaction: ITransactionDto | null, remaining: number) {
      this.id = transaction?.id ?? -1;
      this.text = transaction?.description ?? DEFAULT_TEXT;
      this.value = remaining;
      this.amount = transaction?.amount ?? remaining;
      this.date = transaction?.date ?? '';

      if (transaction !== null) {
         this.name = `Transaction ${transaction.id}`;

         if (transaction.parentId === null || transaction.id > 0) {
            this.link = ['/transactions', 'edit', transaction.id];
         } else {
            this.link = [
               '/transactions',
               'edit-recurring',
               transaction.parentId,
            ];
         }
      } else {
         this.name = DEFAULT_TEXT;
         this.link = null;
      }
   }
}
