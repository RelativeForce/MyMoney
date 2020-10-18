import { Action } from '@ngrx/store';
import {
   SetTransactionsAction,
   UpdateTransactionAction,
   TransactionActionTypes,
   DeleteTransactionAction,
   UpdateDataRangeAction
} from '../actions/transactions.actions';
import { ITransactionModel, IDateRangeModel } from '../types';

export interface ITransactionState {
   transactions: ITransactionModel[];
   dateRange: IDateRangeModel;
   refresh: boolean;
}

export const initialTransactionState: ITransactionState = {
   transactions: [],
   dateRange: defaultDateRange(),
   refresh: true,
};

export function transactionReducer(state: ITransactionState = initialTransactionState, action: Action): ITransactionState {
   switch (action.type) {
      case TransactionActionTypes.SetTransactions:
         return SetTransactions(state, action as SetTransactionsAction);
      case TransactionActionTypes.UpdateTransaction:
         return UpdateTransaction(state, action as UpdateTransactionAction);
      case TransactionActionTypes.DeleteTransaction:
         return DeleteTransaction(state, action as DeleteTransactionAction);
      case TransactionActionTypes.UpdateDataRange:
         return UpdateDataRange(state, action as UpdateDataRangeAction);
      default:
         return state;
   }
}

function SetTransactions(state: ITransactionState, action: SetTransactionsAction): ITransactionState {
   const transactions: ITransactionModel[] = action.transactions;

   return {
      ...state,
      transactions,
      refresh: false
   };
}

function UpdateTransaction(state: ITransactionState, action: UpdateTransactionAction): ITransactionState {
   const transaction: ITransactionModel = action.transaction;

   const index = state.transactions.findIndex(t => t.id === transaction.id);

   state.transactions[index] = transaction;

   return {
      ...state,
      transactions: state.transactions
   };
}

function DeleteTransaction(state: ITransactionState, action: DeleteTransactionAction): ITransactionState {
   const transactionId: number = action.transactionId;

   const index = state.transactions.findIndex(t => t.id === transactionId);

   state.transactions.splice(index, 1);

   return {
      ...state,
      transactions: state.transactions
   };
}

function UpdateDataRange(state: ITransactionState, action: UpdateDataRangeAction): ITransactionState {
   const dateRange: IDateRangeModel = action.dateRange;

   return {
      ...state,
      dateRange,
      refresh: true
   };
}

function defaultDateRange(): IDateRangeModel {
   const end: Date = new Date();

   const start: Date = new Date();
   start.setMonth(start.getMonth() - 1);

   return { end, start };
}
