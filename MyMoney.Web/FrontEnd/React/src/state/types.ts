import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { ISessionModel } from 'mymoney-common/lib/interfaces';

export interface ISessionState {
    currentSession: ISessionModel | null;
    currentUser: IUserState;
}

export type IUserState = IAsyncState & { data: IUserDto | null };

export interface IAppState {
    session: ISessionState;
}

interface IAsyncState {
    status: AsyncStatus,
    error: string | null;
}

export enum AsyncStatus {
    empty = 'empty',
    loading = 'loading',
    succeeded = 'succeeded',
    failed = 'failed',
}