import { Action } from '@ngrx/store';
import {
   SetTransactionsAction,
   UpdateTransactionAction,
   TransactionActionTypes,
   DeleteTransactionAction,
   UpdateDataRangeAction,
   DeleteRecurringTransactionAction,
   RealiseTransactionAction,
} from '../actions';
import { ITransactionModel, IDateRangeModel, ITransactionsSearch } from '../types';

function setTransactions(state: ITransactionState, action: SetTransactionsAction): ITransactionState {
   const transactions: ITransactionModel[] = action.transactions;

   return {
      ...state,
      transactions,
      searchParameters: {
         ...state.searchParameters,
         refresh: false,
      },
   };
}

function refreshTransactions(state: ITransactionState): ITransactionState {
   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         refresh: true,
      },
   };
}

function updateTransaction(state: ITransactionState, action: UpdateTransactionAction): ITransactionState {
   const transaction: ITransactionModel = action.transaction;

   const index = state.transactions.findIndex((t) => t.id === transaction.id);

   const transactions = state.transactions.map((t) => t);

   transactions[index] = transaction;

   return {
      ...state,
      transactions,
   };
}

function realiseTransaction(state: ITransactionState, action: RealiseTransactionAction): ITransactionState {
   const virtualId: number = action.virtualId;
   const realId: number = action.realId;

   const transactions = state.transactions.map((t) => ({
      ...t,
      id: t.id === virtualId ? realId : t.id,
   }));

   return {
      ...state,
      transactions,
   };
}

function deleteTransaction(state: ITransactionState, action: DeleteTransactionAction): ITransactionState {
   const transactionId: number = action.transactionId;

   return {
      ...state,
      transactions: state.transactions.filter((t) => t.id !== transactionId),
   };
}

function deleteRecurringTransaction(state: ITransactionState, action: DeleteRecurringTransactionAction): ITransactionState {
   const transactionId: number = action.transactionId;

   return {
      ...state,
      transactions: state.transactions.filter((t) => t.parentId !== transactionId),
   };
}

function updateDataRange(state: ITransactionState, action: UpdateDataRangeAction): ITransactionState {
   const dateRange: IDateRangeModel = action.dateRange;

   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         dateRange,
         refresh: true,
      },
   };
}

function defaultDateRange(): IDateRangeModel {
   const end: Date = new Date();

   const start: Date = new Date();
   start.setMonth(start.getMonth() - 1);

   return { end, start };
}

export interface ITransactionState {
   transactions: ITransactionModel[];
   searchParameters: ITransactionsSearch;
}

export const initialTransactionState: ITransactionState = {
   transactions: [],
   searchParameters: {
      dateRange: defaultDateRange(),
      refresh: true,
   },
};

export function transactionReducer(state: ITransactionState = initialTransactionState, action: Action): ITransactionState {
   switch (action.type) {
      case TransactionActionTypes.setTransactions:
         return setTransactions(state, action as SetTransactionsAction);
      case TransactionActionTypes.updateTransaction:
         return updateTransaction(state, action as UpdateTransactionAction);
      case TransactionActionTypes.realiseTransaction:
         return realiseTransaction(state, action as RealiseTransactionAction);
      case TransactionActionTypes.deleteTransaction:
         return deleteTransaction(state, action as DeleteTransactionAction);
      case TransactionActionTypes.deleteRecurringTransaction:
         return deleteRecurringTransaction(state, action as DeleteRecurringTransactionAction);
      case TransactionActionTypes.updateDataRange:
         return updateDataRange(state, action as UpdateDataRangeAction);
      case TransactionActionTypes.refreshTransactions:
         return refreshTransactions(state);
      default:
         return state;
   }
}
