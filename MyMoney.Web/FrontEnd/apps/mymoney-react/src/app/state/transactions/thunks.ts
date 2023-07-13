import { createAsyncThunk } from '@reduxjs/toolkit';
import { TransactionApi, IDateRangeDto, ITransactionListDto } from '@mymoney-common/api';
import { IDateRangeModel } from '../types';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../../classess/http-helper';
import { SLICE_NAME } from './constants';

export const fetchTransactions = createAsyncThunk(
   `${SLICE_NAME}/fetchTransactions`,
   async ({ dateRange }: { dateRange: IDateRangeModel }, { getState, rejectWithValue }) => {
      const httpHelper = HttpHelper.forCuurentUser(getState);
      if (!httpHelper) {
         return rejectWithValue('No user session');
      }
      const api = new TransactionApi(httpHelper);

      const dateRangeDto: IDateRangeDto = {
         start: new Date(dateRange.start),
         end: new Date(dateRange.end),
      };

      try {
         return await firstValueFrom(
            api.list(dateRangeDto).pipe(
               first(),
               map((listDto: ITransactionListDto) => listDto.transactions)
            )
         );
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const deleteTransaction = createAsyncThunk(
   `${SLICE_NAME}/deleteTransaction`,
   async ({ transactionId }: { transactionId: number }, { getState, rejectWithValue }) => {
      const httpHelper = HttpHelper.forCuurentUser(getState);
      if (!httpHelper) {
         return rejectWithValue('No user session');
      }
      const api = new TransactionApi(httpHelper);

      try {
         return await firstValueFrom(api.delete({ id: transactionId }).pipe(first()));
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const deleteRecurringTransaction = createAsyncThunk(
   `${SLICE_NAME}/deleteRecurringTransaction`,
   async ({ recurringTransactionId }: { recurringTransactionId: number }, { getState, rejectWithValue }) => {
      const httpHelper = HttpHelper.forCuurentUser(getState);
      if (!httpHelper) {
         return rejectWithValue('No user session');
      }
      const api = new TransactionApi(httpHelper);

      try {
         return await firstValueFrom(api.deleteRecurring({ id: recurringTransactionId }).pipe(first()));
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);
