import { Action } from '@ngrx/store';
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

   return {
      ...state,
      currentSession: newSession
   };
}

function ClearSession(state: ISessionState, action: ClearSessionAction) {
   return {
      ...state,
      currentSession: null
   };
}

