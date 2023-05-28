import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { ISessionModel } from 'mymoney-common/lib/interfaces';

export interface ISessionState {
    currentSession: ISessionModel | null;
    currentUser: IUserDto | null;
}

export interface IAppState {
    session: ISessionState;
}