import { periodString } from '../../functions';
import { ITransactionModel } from '../../state/types';

export class TransactionViewModel {
   date: string;
   description: string;
   editTooltip: string;
   amount: string;
   editLink: string;
   canDelete: boolean;
   id: number;

   constructor(model: ITransactionModel) {
      this.date = model.date;
      this.description = model.description;
      this.amount = '£' + model.amount;
      this.id = model.id;
      this.editLink = `./edit/${model.id}`;
      this.editTooltip = `Edit transaction ${model.id}`;
      this.canDelete = true;

      if (model.recurringTransactionId !== null) {
         this.description += ` (${periodString(model.recurringPeriod)})`;
         this.editLink = `./edit-recurring/${model.recurringTransactionId}`;
         this.editTooltip = `Edit recurring transaction ${model.recurringTransactionId}`;
         this.canDelete = false;
      }
   }
}
