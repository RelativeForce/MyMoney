import { IBudgetModel } from '../../state/types';

export class BudgetViewModel {
   id: number;
   amount: string;
   notes: string;
   monthId: string;
   name: string;
   remaining: string;

   constructor(model: IBudgetModel) {
      this.monthId = model.monthId;
      this.name = model.name;
      this.notes = model.notes;
      this.amount = '£' + model.amount;
      this.id = model.id;
      this.remaining = '£' + model.remaining;
   }
}
