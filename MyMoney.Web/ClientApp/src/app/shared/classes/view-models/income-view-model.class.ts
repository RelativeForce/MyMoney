import { IIncomeModel } from '../../state/types';

export class IncomeViewModel {
   date: string;
   name: string;
   amount: string;
   id: number;

   constructor(model: IIncomeModel) {
      this.date = model.date;
      this.name = model.name;
      this.amount = '£' + model.amount;
      this.id = model.id;
   }
}
