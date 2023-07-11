import { ITransactionDto, IBudgetDto } from '../api/dtos';
import { ISeries } from '../interfaces/series.interface';
import { BudgetSeriesDataPoint } from './budget-series-data-point.class';

export class BudgetSeries implements ISeries<BudgetSeriesDataPoint> {
   public name: string; // Must be unique
   public series: BudgetSeriesDataPoint[];

   private remaining: number;

   constructor(
      public readonly budget: IBudgetDto,
      public readonly color: string
   ) {
      this.name = budget.name;
      this.series = [new BudgetSeriesDataPoint(null, budget.amount)];
      this.remaining = budget.amount;
   }

   public addEntry(transaction: ITransactionDto) {
      if (transaction.budgetIds.includes(this.budget.id)) {
         this.remaining -= transaction.amount;
      }
      this.series[this.series.length] = new BudgetSeriesDataPoint(
         transaction,
         this.remaining
      );
   }
}
