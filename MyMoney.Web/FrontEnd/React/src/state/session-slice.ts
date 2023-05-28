import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { ISessionModel } from 'mymoney-common/lib/interfaces';
import { SESSION_LOCAL_STORAGE_KEY } from 'mymoney-common/lib/constants';
import { ISessionState, IAppState, AsyncStatus, IUserState } from './types';
import { first } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { UserApi } from 'mymoney-common/lib/api';
import { HttpHelper } from '@/classess/http-helper';

export const initialUserState: IUserState = {
   data: null,
   status: AsyncStatus.empty,
   error: null,
};

export const initialSessionState: ISessionState = {
   currentSession: null,
   currentUser: initialUserState
};

export const fetchUser = createAsyncThunk('session/fetchUser', async (token: string) => {
   const httpHelper = new HttpHelper(token);
   const api = new UserApi(httpHelper);

   try {
      return await firstValueFrom(api.currentUserDetails().pipe(first()));
   } catch (error: any) {
      return error.message;
   }
});

export const sessionSlice = createSlice({
   name: 'session',
   initialState: initialSessionState,
   reducers: {
      startSession: {
         reducer: (state: ISessionState, { payload }: { payload: ISessionModel }) => {
            localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(payload));
            console.log('Session: Cached in local storage');

            return {
               ...state,
               currentSession: payload
            };
         },
         prepare: (token: string, sessionEnd: string) => {
            return { payload: { token, sessionEnd } };
         }
      },
      clearSession: (state: ISessionState) => {

         localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
         console.log('Session: Cleared local storage');

         return {
            ...state,
            currentSession: null,
            currentUser: initialUserState
         };
      },
      setUser: {
         reducer: (state: ISessionState, { payload }: { payload: IUserDto }) => {
            return {
               ...state,
               currentUser: {
                  data: payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               }
            };
         },
         prepare: (user: IUserDto) => {
            return { payload: user };
         }
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
               }
            };
         })
         .addCase(fetchUser.fulfilled, (state: ISessionState, action: { payload : IUserDto }) => {
            return {
               ...state,
               currentUser: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               }
            };
         })
         .addCase(fetchUser.rejected, (state: ISessionState, action) => {
            return {
               ...state,
               currentUser: {
                  data: null,
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               }
            };
         });
   }
});

export const { startSession, clearSession, setUser } = sessionSlice.actions;

export const selectSessionState = (state: IAppState): ISessionState => state.session;
export const selectCurrentSession = (state: IAppState): ISessionModel | null => selectSessionState(state).currentSession;
export const selectCurrentUser = (state: IAppState): IUserDto | null => selectSessionState(state).currentUser.data;
export const selectCurrentUserState = (state: IAppState): IUserState => selectSessionState(state).currentUser;

export default sessionSlice.reducer;
