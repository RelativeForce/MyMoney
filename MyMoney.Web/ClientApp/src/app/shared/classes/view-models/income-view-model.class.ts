import { IIncomeModel } from '../../state/types';

export class IncomeViewModel {
   date: string;
   name: string;
   amount: string;
   remaining: string;
   id: number;
   showWarning: boolean;

   constructor(model: IIncomeModel) {
      this.date = model.date;
      this.name = model.name;
      this.amount = '£' + model.amount;
      this.remaining = '£' + model.remaining;
      this.id = model.id;
      this.showWarning = model.remaining < 0;
   }
}
