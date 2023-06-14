import { toFrequencyString } from '../../functions';
import { IIncomeDto, Frequency } from '../../api/dtos';

export class IncomeViewModel {
   date: string;
   name: string;
   amount: string;
   remaining: string;
   id: number;
   showWarning: boolean;
   parentId: number | null;
   parentFrequency: Frequency | null;

   constructor(model: IIncomeDto) {
      this.date = model.date;
      this.name = model.name;
      this.amount = '£' + model.amount;
      this.remaining = '£' + model.remaining;
      this.id = model.id;
      this.showWarning = model.remaining < 0;
      this.parentId = model.parentId;
      this.parentFrequency = model.parentFrequency;

      if (model.parentId !== null) {
         this.name += ` (${toFrequencyString(model.parentFrequency)})`;
      }
   }
}
