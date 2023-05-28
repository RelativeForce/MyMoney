import { createSlice } from '@reduxjs/toolkit';
import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { ISessionModel } from 'mymoney-common/lib/interfaces';
import { SESSION_LOCAL_STORAGE_KEY } from 'mymoney-common/lib/constants';
import { ISessionState, IAppState } from './types';

export const initialSessionState: ISessionState = {
   currentSession: null,
   currentUser: null
};

export const sessionSlice = createSlice({
   name: 'session',
   initialState: initialSessionState,
   reducers: {
      startSession: (state: ISessionState, { payload }: { payload: ISessionModel }) => {
         localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(payload));
         console.log('Session: Cached in local storage');

         return {
            ...state,
            currentSession: payload
         };
      },
      clearSession: (state: ISessionState) => {

         localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
         console.log('Session: Cleared local storage');

         return {
            ...state,
            currentSession: null,
            currentUser: null
         };
      },
      setUser: (state: ISessionState, { payload }: { payload: IUserDto }) => {

         return {
            ...state,
            currentUser: {
               email: payload.email,
               dateOfBirth: payload.dateOfBirth,
               fullName: payload.fullName,
            }
         };
      },
   }
});

export const { startSession, clearSession, setUser } = sessionSlice.actions;

export const selectSessionState = (state: IAppState): ISessionState => state.session;
export const selectCurrentSession = (state: IAppState): ISessionModel | null => selectSessionState(state).currentSession;
export const selectCurrentUser = (state: IAppState): IUserDto | null => selectSessionState(state).currentUser;

export default sessionSlice.reducer;
