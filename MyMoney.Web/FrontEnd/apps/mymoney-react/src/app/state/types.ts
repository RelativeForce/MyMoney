import { IBudgetDto, IRunningTotalDto, ITransactionDto, IUserDto } from '@mymoney-common/api';
import { ISessionModel } from '@mymoney-common/interfaces';

export interface IAppState {
   session: ISessionState;
   transactions: ITransactionState;
   budgets: IBudgetState;
   remainingBudgetChart: IRemainingBudgetChartState;
   runningTotalChart: IRunningTotalChartState;
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
   searchParameters: IMonthSearch;
}

export interface IMonthSearch {
   year: number;
   month: number;
   refresh: boolean;
}

export interface IRemainingBudgetChartState {
   searchParameters: IMonthSearch;
   budgets: IAsyncState<IBudgetDto[]>;
   transactions: IAsyncState<ITransactionDto[]>;
}

export interface IYearSearch {
   year: number;
   refresh: boolean;
}

export interface IRunningTotalChartState {
   searchParameters: IYearSearch;
   runningTotals: IAsyncState<IRunningTotalDto[]>;
}
