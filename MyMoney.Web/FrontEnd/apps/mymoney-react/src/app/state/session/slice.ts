import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { AuthenticationApi, UserApi, ILoginDto, ILoginResultDto, IUserDto } from '@mymoney-common/api';
import { ISessionModel } from '@mymoney-common/interfaces';
import { SESSION_LOCAL_STORAGE_KEY } from '@mymoney-common/constants';
import { ISessionState, AsyncStatus, IAsyncState } from '../types';
import { first } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../../classess/http-helper';

const SLICE_NAME = 'session';

export const initialUserState: IAsyncState<IUserDto | null> = {
   data: null,
   status: AsyncStatus.empty,
   error: null,
};

export const initialSessionState: ISessionState = {
   currentSession: null,
   currentUser: initialUserState,
};

export const fetchUser = createAsyncThunk(`${SLICE_NAME}/fetchUser`, async (_, { getState, rejectWithValue }) => {
   const httpHelper = HttpHelper.forCuurentUser(getState);
   if (!httpHelper) {
      return rejectWithValue('No user session');
   }
   const api = new UserApi(httpHelper);

   try {
      return await firstValueFrom(api.currentUserDetails().pipe(first()));
   } catch (error: any) {
      return rejectWithValue(error.message);
   }
});

export const login = createAsyncThunk(`${SLICE_NAME}/login`, async (credentials: ILoginDto, { rejectWithValue }) => {
   const httpHelper = HttpHelper.forAnnonymous();
   const api = new AuthenticationApi(httpHelper);

   try {
      return await firstValueFrom(api.login(credentials).pipe(first()));
   } catch (error: any) {
      return rejectWithValue(error.message);
   }
});

export const updateUser = createAsyncThunk(`${SLICE_NAME}/updateUser`, async (user: IUserDto, { getState, rejectWithValue }) => {
   const httpHelper = HttpHelper.forCuurentUser(getState);
   if (!httpHelper) {
      return rejectWithValue('No user session');
   }
   const api = new UserApi(httpHelper);

   try {
      const result = await firstValueFrom(api.updateCurrentUserDetails(user).pipe(first()));

      if (!result.success) {
         return rejectWithValue(result.error);
      }

      return {
         ...user,
         dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString('en-GB'),
      };
   } catch (error: any) {
      return rejectWithValue(error.message);
   }
});

export const sessionSlice = createSlice({
   name: SLICE_NAME,
   initialState: initialSessionState,
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
      clearSession: (state: ISessionState) => {
         localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
         console.log('Session: Cleared local storage');

         return {
            ...state,
            currentSession: null,
            currentUser: initialUserState,
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

export const { setSession, clearSession, setUser } = sessionSlice.actions;

export default sessionSlice.reducer;