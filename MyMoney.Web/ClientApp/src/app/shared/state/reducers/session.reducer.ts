import { Action } from '@ngrx/store';
import { IUserDto } from '../../api';
import { SESSION_LOCAL_STORAGE_KEY } from '../../constants';
import { SessionActionTypes, StartSessionAction, ClearSessionAction, SetUserAction } from '../actions';
import { ISessionModel, IUser } from '../types';

export interface ISessionState {
   currentSession: ISessionModel | null;
   currentUser: IUser | null;
}

export const initialSessionState: ISessionState = {
   currentSession: null,
   currentUser: null
};

export function sessionReducer(state: ISessionState = initialSessionState, action: Action): ISessionState {
   switch (action.type) {
      case SessionActionTypes.StartSession:
         return startSession(state, action as StartSessionAction);
      case SessionActionTypes.ClearSession:
         return clearSession(state, action as ClearSessionAction);
      case SessionActionTypes.SetUser:
         return setUser(state, action as SetUserAction);
      default:
         return state;
   }
}

function startSession(state: ISessionState, action: StartSessionAction) {

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

function setUser(state: ISessionState, action: SetUserAction) {

   const user: IUserDto = action.user;

   return {
      ...state,
      currentUser: {
         email: user.email,
         dateOfBirth: user.dateOfBirth,
         fullName: user.fullName,
      }
   };
}

function clearSession(state: ISessionState, action: ClearSessionAction) {

   localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
   console.log('Session: Cleared local storage');

   return {
      ...state,
      currentSession: null,
      currentUser: null
   };
}

