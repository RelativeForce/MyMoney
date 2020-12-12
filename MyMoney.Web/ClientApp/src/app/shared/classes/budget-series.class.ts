import { ISeries } from '../interfaces/series.interface';
import { IBudgetModel, ITransactionModel } from '../state/types';
import { BudgetSeriesDataPoint } from './budget-series-data-point.class';

export class BudgetSeries implements ISeries {
   public name: string; // Must be unique
   public text: string;
   public series: BudgetSeriesDataPoint[];
   private remaining: number;

   private id: number;

   constructor(budget: IBudgetModel) {
      this.name = budget.name;
      this.series = [new BudgetSeriesDataPoint(null, budget.amount)];
      this.remaining = budget.amount;
      this.id = budget.id;
   }

   public addEntry(transaction: ITransactionModel) {
      if (transaction.budgetIds.includes(this.id)) {
         this.remaining -= transaction.amount;
      }
      this.series[this.series.length] = new BudgetSeriesDataPoint(transaction, this.remaining);
   }
}
