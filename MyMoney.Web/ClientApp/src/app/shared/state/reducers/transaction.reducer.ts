import { Action } from '@ngrx/store';
import {
   SetTransactionsAction,
   UpdateTransactionAction,
   TransactionActionTypes,
   DeleteTransactionAction,
   UpdateDataRangeAction
} from '../actions';
import { ITransactionModel, IDateRangeModel, ITransactionsSearch } from '../types';

export interface ITransactionState {
   transactions: ITransactionModel[];
   searchParameters: ITransactionsSearch;
}

export const initialTransactionState: ITransactionState = {
   transactions: [],
   searchParameters: {
      dateRange: defaultDateRange(),
      refresh: true,
   }
};

export function transactionReducer(state: ITransactionState = initialTransactionState, action: Action): ITransactionState {
   switch (action.type) {
      case TransactionActionTypes.SetTransactions:
         return setTransactions(state, action as SetTransactionsAction);
      case TransactionActionTypes.UpdateTransaction:
         return updateTransaction(state, action as UpdateTransactionAction);
      case TransactionActionTypes.DeleteTransaction:
         return deleteTransaction(state, action as DeleteTransactionAction);
      case TransactionActionTypes.UpdateDataRange:
         return updateDataRange(state, action as UpdateDataRangeAction);
      case TransactionActionTypes.RefreshTransactions:
         return refreshTransactions(state);
      default:
         return state;
   }
}

function setTransactions(state: ITransactionState, action: SetTransactionsAction): ITransactionState {
   const transactions: ITransactionModel[] = action.transactions;

   return {
      ...state,
      transactions,
      searchParameters: {
         ...state.searchParameters,
         refresh: false
      }
   };
}

function refreshTransactions(state: ITransactionState): ITransactionState {
   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         refresh: true
      }
   };
}

function updateTransaction(state: ITransactionState, action: UpdateTransactionAction): ITransactionState {
   const transaction: ITransactionModel = action.transaction;

   const index = state.transactions.findIndex(t => t.id === transaction.id);

   const transactions = state.transactions.map(t => t);

   transactions[index] = transaction;

   return {
      ...state,
      transactions
   };
}

function deleteTransaction(state: ITransactionState, action: DeleteTransactionAction): ITransactionState {
   const transactionId: number = action.transactionId;

   const index = state.transactions.findIndex(t => t.id === transactionId);

   const transactions = state.transactions.map(t => t);

   transactions.splice(index, 1);

   return {
      ...state,
      transactions
   };
}

function updateDataRange(state: ITransactionState, action: UpdateDataRangeAction): ITransactionState {
   const dateRange: IDateRangeModel = action.dateRange;

   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         dateRange,
         refresh: true
      }
   };
}

function defaultDateRange(): IDateRangeModel {
   const end: Date = new Date();

   const start: Date = new Date();
   start.setMonth(start.getMonth() - 1);

   return { end, start };
}
