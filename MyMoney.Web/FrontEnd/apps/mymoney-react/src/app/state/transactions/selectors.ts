import { ITransactionDto } from '@mymoney-common/api';
import { IAppState, ITransactionsState, IDateRangeSearch } from '../types';

export const selectTransactionsListState = (state: IAppState): ITransactionsState => state.transactions;
export const selectTransactions = (state: IAppState): ITransactionDto[] => selectTransactionsListState(state).list.data;
export const selectSearchParameters = (state: IAppState): IDateRangeSearch => selectTransactionsListState(state).searchParameters;
export function selectTransaction(transactionId: number): (state: IAppState) => ITransactionDto | undefined {
   return (state: IAppState): ITransactionDto | undefined => selectTransactions(state).find((t: ITransactionDto) => t.id === transactionId);
}
