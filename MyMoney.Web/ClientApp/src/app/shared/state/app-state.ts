import { ActionReducerMap } from '@ngrx/store';
import { ISessionState, sessionReducer, ITransactionState, transactionReducer } from './reducers/';

export interface IAppState {
   session: ISessionState;
   transactions: ITransactionState;
}

export const appReducer: ActionReducerMap<IAppState | any> = {
   session: sessionReducer,
   transactions: transactionReducer,
};
