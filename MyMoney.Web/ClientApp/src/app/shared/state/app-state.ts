import { ActionReducerMap } from '@ngrx/store';
import { ISessionState, sessionReducer } from './reducers/';

export interface IAppState {
   session: ISessionState;
}

export const appReducer: ActionReducerMap<IAppState | any> = {
   session: sessionReducer,
};
