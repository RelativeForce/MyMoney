import { TransactionModel } from './transaction.model';

export interface TransactionListResponse {
   transactions: Array<TransactionModel>;
}
