import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ILoginResultDto, IUserDto } from '@mymoney-common/api';
import { ISessionModel } from '@mymoney-common/interfaces';
import { SESSION_LOCAL_STORAGE_KEY } from '@mymoney-common/constants';
import { ISessionState, AsyncStatus } from '../types';
import { fetchUser, login, updateUser } from './thunks';
import { SLICE_NAME } from './constants';

const initialState: ISessionState = {
   currentSession: null,
   currentUser: {
      data: null,
      status: AsyncStatus.empty,
      error: null,
   },
};

const slice = createSlice({
   name: SLICE_NAME,
   initialState: initialState,
   reducers: {
      setSession: {
         reducer: (state: ISessionState, { payload }: { payload: ISessionModel }) => {
            localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(payload));
            console.log('Session: Cached in local storage');

            return {
               ...state,
               currentSession: payload,
            };
         },
         prepare: (token: string, sessionEnd: string) => {
            return { payload: { token, sessionEnd } };
         },
      },
      clearSession: () => {
         localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
         console.log('Session: Cleared local storage');

         return initialState;
      },
      setUser: {
         reducer: (state: ISessionState, { payload }: { payload: IUserDto }) => {
            return {
               ...state,
               currentUser: {
                  data: payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         },
         prepare: (user: IUserDto) => {
            return { payload: user };
         },
      },
   },
   extraReducers(builder: ActionReducerMapBuilder<ISessionState>) {
      builder
         .addCase(fetchUser.pending, (state: ISessionState) => {
            return {
               ...state,
               currentUser: {
                  data: null,
                  status: AsyncStatus.loading,
                  error: null,
               },
            };
         })
         .addCase(fetchUser.fulfilled, (state: ISessionState, action: { payload: IUserDto }) => {
            return {
               ...state,
               currentUser: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchUser.rejected, (state: ISessionState, action) => {
            return {
               ...state,
               currentUser: {
                  data: null,
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         })
         .addCase(login.fulfilled, (state: ISessionState, action: { payload: ILoginResultDto }) => {
            const sesssion: ISessionModel = {
               sessionEnd: action.payload.validTo,
               token: action.payload.token,
            };

            localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(sesssion));
            console.log('Session: Cached in local storage');

            return {
               ...state,
               currentSession: sesssion,
            };
         })
         .addCase(updateUser.pending, (state: ISessionState) => {
            return {
               ...state,
               currentUser: {
                  data: state.currentUser.data,
                  status: AsyncStatus.loading,
                  error: null,
               },
            };
         })
         .addCase(updateUser.fulfilled, (state: ISessionState, action: { payload: IUserDto }) => {
            return {
               ...state,
               currentUser: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(updateUser.rejected, (state: ISessionState, action) => {
            return {
               ...state,
               currentUser: {
                  data: state.currentUser.data,
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         });
   },
});

export const { setSession, clearSession, setUser } = slice.actions;

export const reducer = slice.reducer;
