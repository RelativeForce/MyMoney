import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthenticationApi, UserApi, ILoginDto, IUserDto } from '@mymoney-common/api';
import { first } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../../classess/http-helper';
import { SLICE_NAME } from './constants';

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
