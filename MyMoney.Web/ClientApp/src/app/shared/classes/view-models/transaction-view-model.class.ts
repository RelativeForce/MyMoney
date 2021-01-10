import { toFrequencyString } from '../../functions';
import { ITransactionModel } from '../../state/types';

export class TransactionViewModel {
   date: string;
   description: string;
   amount: string;
   recurringTransactionId: number | null;
   id: number;

   constructor(model: ITransactionModel) {
      this.date = model.date;
      this.description = model.description;
      this.amount = '£' + model.amount;
      this.id = model.id;
      this.recurringTransactionId = model.recurringTransactionId;

      if (model.recurringTransactionId !== null) {
         this.description += ` (${toFrequencyString(model.recurringFrequency)})`;
      }
   }
}
