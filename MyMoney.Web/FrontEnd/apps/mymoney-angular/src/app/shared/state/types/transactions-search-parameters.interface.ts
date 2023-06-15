import { IDateRangeModel } from './date-range-model.interface';

export interface ITransactionsSearch {
   dateRange: IDateRangeModel;
   refresh: boolean;
}
