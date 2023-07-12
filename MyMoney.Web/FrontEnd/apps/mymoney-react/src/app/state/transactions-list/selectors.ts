import { ITransactionDto } from '@mymoney-common/api';
import { IAppState, ITransactionState, ITransactionsSearch } from '../types';

export const selectTransactionsListState = (state: IAppState): ITransactionState => state.transactions;
export const selectTransactions = (state: IAppState): ITransactionDto[] => selectTransactionsListState(state).transactions.data;
export const selectSearchParameters = (state: IAppState): ITransactionsSearch => selectTransactionsListState(state).searchParameters;
export function selectTransaction(transactionId: number): (state: IAppState) => ITransactionDto | undefined {
   return (state: IAppState): ITransactionDto | undefined => selectTransactions(state).find((t: ITransactionDto) => t.id === transactionId);
}
