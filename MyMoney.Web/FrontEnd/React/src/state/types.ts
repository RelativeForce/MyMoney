import { ITransactionDto, IUserDto } from 'mymoney-common/lib/api/dtos';
import { ISessionModel } from 'mymoney-common/lib/interfaces';

export interface ISessionState {
    currentSession: ISessionModel | null;
    currentUser: IAsyncState<IUserDto | null>;
}

export interface IAppState {
    session: ISessionState;
    transactions: ITransactionState;
}

export interface IAsyncState<T> {
    data: T;
    status: AsyncStatus,
    error: string | null;
}

export enum AsyncStatus {
    empty = 'empty',
    loading = 'loading',
    succeeded = 'succeeded',
    failed = 'failed',
}

export interface ITransactionState {
    transactions: IAsyncState<ITransactionDto[]>;
    searchParameters: ITransactionsSearch;
}

export interface ITransactionsSearch {
    dateRange: IDateRangeModel;
    refresh: boolean,
}

export interface IDateRangeModel {
    start: string;
    end: string;
}