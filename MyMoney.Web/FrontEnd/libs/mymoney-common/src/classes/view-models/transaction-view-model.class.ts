import { toFrequencyString } from '../../functions';
import { ITransactionDto } from '../../api/dtos';

export class TransactionViewModel {
   date: string;
   description: string;
   amount: string;
   parentId: number | null;
   id: number;

   constructor(model: ITransactionDto) {
      this.date = model.date;
      this.description = model.description;
      this.amount = '£' + model.amount;
      this.id = model.id;
      this.parentId = model.parentId;

      if (model.parentId !== null) {
         this.description += ` (${toFrequencyString(model.parentFrequency)})`;
      }
   }
}
