import { IBudgetModel } from '../../state/types';

export class BudgetViewModel {
   id: number;
   amount: string;
   notes: string;
   month: number;
   year: number;
   name: string;
   remaining: string;
   showWarning: boolean;

   constructor(model: IBudgetModel) {
      this.month = model.month;
      this.year = model.year;
      this.name = model.name;
      this.notes = model.notes;
      this.amount = '£' + model.amount;
      this.id = model.id;
      this.remaining = '£' + model.remaining;
      this.showWarning = model.remaining < 0;
   }
}
