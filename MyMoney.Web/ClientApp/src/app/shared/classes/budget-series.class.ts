import { IBudgetModel, ITransactionModel } from '../state/types';
import { BudgetSeriesDataPoint } from './budget-series-data-point.class';

export class BudgetSeries {

   public id: number;
   public name: string;
   public series: BudgetSeriesDataPoint[];
   private remaining: number;

   constructor(budget: IBudgetModel) {
      this.name = budget.name;
      this.series = [new BudgetSeriesDataPoint(null, budget.amount)];
      this.remaining = budget.amount;
      this.id = budget.id;
   }

   public addTransaction(transaction: ITransactionModel) {
      if (transaction.budgetIds.includes(this.id)) {
         this.remaining -= transaction.amount;
      }
      this.series[this.series.length] = new BudgetSeriesDataPoint(transaction, this.remaining);
   }
}