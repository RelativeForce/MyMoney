import { TransactionModel } from './transaction.model';

export class TransactionViewModel {
   date: string;
   description: string;
   amount: string;
   id: Number;

   constructor(model: TransactionModel) {
      this.date = model.date;
      this.description = model.description;
      this.amount = '£' + model.amount;
      this.id = model.id;
   }
}
