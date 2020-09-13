import { TransactionModel } from './transaction-model.interface';

export interface TransactionListResponse {
   transactions: Array<TransactionModel>;
}
