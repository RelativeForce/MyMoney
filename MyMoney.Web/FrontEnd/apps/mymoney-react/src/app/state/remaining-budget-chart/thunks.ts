import { createAsyncThunk } from '@reduxjs/toolkit';
import { BudgetApi, IBudgetListDto, IBudgetSearchDto, IDateRangeDto, ITransactionListDto, TransactionApi } from '@mymoney-common/api';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../../classess/http-helper';
import { SLICE_NAME } from './constants';

function getMonthDateRange(search: IBudgetSearchDto): IDateRangeDto {
   const end: Date = new Date();
   end.setDate(1);
   end.setFullYear(search.year);
   end.setMonth(search.month);
   end.setHours(0, 0, 0, 0);
   end.setDate(0); // Subtract 1 day

   const start: Date = new Date();
   start.setDate(1);
   start.setFullYear(search.year);
   start.setMonth(search.month - 1);
   start.setHours(0, 0, 0, 0);

   return { end, start };
}

export const fetchBudgets = createAsyncThunk(
   `${SLICE_NAME}/fetchBudgets`,
   async ({ search }: { search: IBudgetSearchDto }, { getState, rejectWithValue }) => {
      const httpHelper = HttpHelper.forCuurentUser(getState);
      if (!httpHelper) {
         return rejectWithValue('No user session');
      }
      const api = new BudgetApi(httpHelper);

      try {
         return await firstValueFrom(
            api.list(search).pipe(
               first(),
               map((listDto: IBudgetListDto) => listDto.budgets)
            )
         );
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const fetchTransactions = createAsyncThunk(
   `${SLICE_NAME}/fetchTransactions`,
   async ({ search }: { search: IBudgetSearchDto }, { getState, rejectWithValue }) => {
      const httpHelper = HttpHelper.forCuurentUser(getState);
      if (!httpHelper) {
         return rejectWithValue('No user session');
      }
      const api = new TransactionApi(httpHelper);

      const dateRangeDto = getMonthDateRange(search);

      try {
         return await firstValueFrom(
            api.list(dateRangeDto).pipe(
               first(),
               map((listDto: ITransactionListDto) => listDto.transactions.reverse())
            )
         );
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);
