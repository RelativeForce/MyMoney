import { TransactionModel } from "./transaction.model";
import { DateRangeModel } from "./date.range.model";

export interface TransactionListResponse {
  dateRange: DateRangeModel;
  transactions: Array<TransactionModel>;
}
