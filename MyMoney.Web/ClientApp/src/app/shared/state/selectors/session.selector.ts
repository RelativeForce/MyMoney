import { IAppState } from '../app-state';
import { ISessionState } from '../reducers';
import { ISessionModel } from '../types';

export const selectSessionState = (state: IAppState): ISessionState => state.session;

export const selectCurrentSession = (state: IAppState): ISessionModel | null => selectSessionState(state).currentSession;
