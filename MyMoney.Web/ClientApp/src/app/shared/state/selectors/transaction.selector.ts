import { IAppState } from '../app-state';
import { ITransactionState } from '../reducers';
import { ITransactionsSearch, ITransactionModel, IDateRangeModel } from '../types';

export const selectTransactionState = (state: IAppState): ITransactionState => state.transactions;

export const selectTransactions = (state: IAppState): ITransactionModel[] => selectTransactionState(state).transactions;

export const selectTransactionsSearchParameters = (state: IAppState): ITransactionsSearch => selectTransactionState(state).searchParameters;

export const selectTransactionsDateRange = (state: IAppState): IDateRangeModel => selectTransactionsSearchParameters(state).dateRange;

export function selectTransaction(transactionId: number): (state: IAppState) => ITransactionModel | undefined {
   return (state: IAppState): ITransactionModel | undefined => selectTransactions(state).find((t) => t.id === transactionId);
}
