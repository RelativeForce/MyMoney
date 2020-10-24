import { Action } from '@ngrx/store';
import { IDateRangeModel, ITransactionModel } from '../types';

export enum TransactionActionTypes {
   SetTransactions = 'Set transactions',
   UpdateTransaction = 'Update transaction',
   DeleteTransaction = 'Delete transaction',
   UpdateDataRange = 'Update Data Range',
   RefreshTransactions = 'Refresh Transactions',
}

export class SetTransactionsAction implements Action {
   public type: string = TransactionActionTypes.SetTransactions;

   constructor(public readonly transactions: ITransactionModel[]) { }
}

export class UpdateTransactionAction implements Action {
   public type: string = TransactionActionTypes.UpdateTransaction;

   constructor(public readonly transaction: ITransactionModel) { }
}

export class DeleteTransactionAction implements Action {
   public type: string = TransactionActionTypes.DeleteTransaction;

   constructor(public readonly transactionId: number) { }
}

export class UpdateDataRangeAction implements Action {
   public type: string = TransactionActionTypes.UpdateDataRange;

   constructor(public readonly dateRange: IDateRangeModel) { }
}

export class RefreshTransactionsAction implements Action {
   public type: string = TransactionActionTypes.RefreshTransactions;

   constructor() { }
}
