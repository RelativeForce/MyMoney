import { IBudgetDto, IRunningTotalDto, ITransactionDto, IUserDto } from '@mymoney-common/api';
import { ISessionModel } from '@mymoney-common/interfaces';

export interface IAppState {
   session: ISessionState;
   transactions: ITransactionsState;
   budgets: IBudgetsState;
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

export interface ITransactionsState {
   list: IAsyncState<ITransactionDto[]>;
   searchParameters: IDateRangeSearch;
}

export interface IDateRangeSearch {
   dateRange: IDateRange;
   refresh: boolean;
}

export interface IDateRange {
   start: string;
   end: string;
}

export interface IBudgetsState {
   list: IAsyncState<IBudgetDto[]>;
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
