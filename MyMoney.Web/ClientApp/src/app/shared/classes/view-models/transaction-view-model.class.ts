import { Period } from '../../api';
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
         this.description += ` (${TransactionViewModel.periodString(model.recurringPeriod)})`;
         this.editLink = `./recurring/edit/${model.recurringTransactionId}`;
         this.editTooltip = `Edit recurring transaction ${model.recurringTransactionId}`;
         this.canDelete = false;
      }
   }

   private static periodString(period: Period): string {
      switch (period) {
         case Period.day: return 'Daily';
         case Period.week: return 'Weekly';
         case Period.month: return 'Monthly';
         case Period.year: return 'Annually';
      }
   }
}
