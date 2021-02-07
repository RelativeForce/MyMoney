import { Frequency } from '../../api';
import { IIncomeModel } from '../../state/types';

export class IncomeViewModel {
   date: string;
   name: string;
   amount: string;
   remaining: string;
   id: number;
   showWarning: boolean;
   parentId: number | null;
   parentFrequency: Frequency | null;

   constructor(model: IIncomeModel) {
      this.date = model.date;
      this.name = model.name;
      this.amount = '£' + model.amount;
      this.remaining = '£' + model.remaining;
      this.id = model.id;
      this.showWarning = model.remaining < 0;
      this.parentId = model.parentId;
      this.parentFrequency = model.parentFrequency;
   }
}
