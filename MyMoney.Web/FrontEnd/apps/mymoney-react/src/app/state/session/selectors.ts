import { IUserDto } from '@mymoney-common/api';
import { ISessionModel } from '@mymoney-common/interfaces';
import { ISessionState, IAppState, IAsyncState } from '../types';

export const selectSessionState = (state: IAppState): ISessionState => state.session;
export const selectCurrentSession = (state: IAppState): ISessionModel | null => selectSessionState(state).currentSession;
export const selectCurrentSessionToken = (state: IAppState): string | null => selectCurrentSession(state)?.token ?? null;
export const selectCurrentUser = (state: IAppState): IUserDto | null => selectCurrentUserState(state).data;
export const selectCurrentUserState = (state: IAppState): IAsyncState<IUserDto | null> => selectSessionState(state).currentUser;
