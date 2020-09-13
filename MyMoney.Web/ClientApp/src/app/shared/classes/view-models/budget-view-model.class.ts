import { BudgetModel } from '../../interfaces/budget-model.interface';

export class BudgetViewModel {
   id: Number;
   amount: string;
   notes: string;
   monthId: string;
   name: string;
   remaining: string;

   constructor(model: BudgetModel) {
      this.monthId = model.monthId;
      this.name = model.name;
      this.notes = model.notes;
      this.amount = '£' + model.amount;
      this.id = model.id;
      this.remaining = '£' + model.remaining;
   }
}
