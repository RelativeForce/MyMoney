import { Action } from '@ngrx/store';
import { SESSION_LOCAL_STORAGE_KEY } from '../../constants';
import { SessionActionTypes, StartSessionAction, ClearSessionAction } from '../actions';
import { ISessionModel } from '../types';

export interface ISessionState {
   currentSession: ISessionModel | null;
}

export const initialSessionState: ISessionState = {
   currentSession: null
};

export function sessionReducer(state: ISessionState = initialSessionState, action: Action): ISessionState {
   switch (action.type) {
      case SessionActionTypes.StartSession:
         return StartSession(state, action as StartSessionAction);
      case SessionActionTypes.ClearSession:
         return ClearSession(state, action as ClearSessionAction);
      default:
         return state;
   }
}

function StartSession(state: ISessionState, action: StartSessionAction) {

   const token: string = action.token;
   const sessionEnd: string = action.sessionEnd;

   // Create new session
   const newSession = {
      token,
      sessionEnd
   };

   localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(newSession));
   console.log('Session: Cached in local storage');

   return {
      ...state,
      currentSession: newSession
   };
}

function ClearSession(state: ISessionState, action: ClearSessionAction) {

   localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
   console.log('Session: Cleared local storage');

   return {
      ...state,
      currentSession: null
   };
}

