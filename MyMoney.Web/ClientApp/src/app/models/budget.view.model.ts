import { BudgetModel } from "./budget.model";

export class BudgetViewModel {
  id: Number;
  amount: string;
  notes: string;
  monthId: string;
  name: string;

  constructor(model: BudgetModel) {
    this.monthId = model.monthId;
    this.name = model.name;
    this.notes = model.notes;
    this.amount = "£" + model.amount;
    this.id = model.id;
  }
}
