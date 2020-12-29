import { Action } from '@ngrx/store';
import { IDateRangeModel, ITransactionModel } from '../types';

export enum TransactionActionTypes {
   setTransactions = 'Set transactions',
   updateTransaction = 'Update transaction',
   deleteTransaction = 'Delete transaction',
   updateDataRange = 'Update Data Range',
   refreshTransactions = 'Refresh Transactions',
}

export class SetTransactionsAction implements Action {
   public type: string = TransactionActionTypes.setTransactions;

   constructor(public readonly transactions: ITransactionModel[]) { }
}

export class UpdateTransactionAction implements Action {
   public type: string = TransactionActionTypes.updateTransaction;

   constructor(public readonly transaction: ITransactionModel) { }
}

export class DeleteTransactionAction implements Action {
   public type: string = TransactionActionTypes.deleteTransaction;

   constructor(public readonly transactionId: number) { }
}

export class UpdateDataRangeAction implements Action {
   public type: string = TransactionActionTypes.updateDataRange;

   constructor(public readonly dateRange: IDateRangeModel) { }
}

export class RefreshTransactionsAction implements Action {
   public type: string = TransactionActionTypes.refreshTransactions;

   constructor() { }
}
