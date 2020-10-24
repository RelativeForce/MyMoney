import { ITransactionModel } from '../../state/types';

export class TransactionViewModel {
   date: string;
   description: string;
   amount: string;
   id: number;

   constructor(model: ITransactionModel) {
      this.date = model.date;
      this.description = model.description;
      this.amount = '£' + model.amount;
      this.id = model.id;
   }
}
