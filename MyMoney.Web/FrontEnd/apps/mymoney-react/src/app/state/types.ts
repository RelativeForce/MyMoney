import { IBudgetDto, ITransactionDto, IUserDto } from '@mymoney-common/api';
import { ISessionModel } from '@mymoney-common/interfaces';

export interface IAppState {
   session: ISessionState;
   transactions: ITransactionState;
   budgets: IBudgetState;
   remainingBudgetChart: IRemainingBudgetChartState;
}

export interface IAsyncState<T> {
   data: T;
   status: AsyncStatus;
   error: string | null;
}

export enum AsyncStatus {
   empty = 'empty',
   loading = 'loading',
   succeeded = 'succeeded',
   failed = 'failed',
}

export interface ISessionState {
   currentSession: ISessionModel | null;
   currentUser: IAsyncState<IUserDto | null>;
}

export interface ITransactionState {
   transactions: IAsyncState<ITransactionDto[]>;
   searchParameters: ITransactionsSearch;
}

export interface ITransactionsSearch {
   dateRange: IDateRangeModel;
   refresh: boolean;
}

export interface IDateRangeModel {
   start: string;
   end: string;
}

export interface IBudgetState {
   budgets: IAsyncState<IBudgetDto[]>;
   searchParameters: IBudgetsSearch;
}

export interface IBudgetsSearch {
   year: number;
   month: number;
   refresh: boolean;
}

export interface IRemainingBudgetChartState {
   searchParameters: IBudgetsSearch;
   budgets: IAsyncState<IBudgetDto[]>;
   transactions: IAsyncState<ITransactionDto[]>;
}
