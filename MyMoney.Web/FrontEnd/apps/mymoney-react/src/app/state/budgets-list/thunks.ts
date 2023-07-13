import { createAsyncThunk } from '@reduxjs/toolkit';
import { BudgetApi, IBudgetListDto, IBudgetSearchDto } from '@mymoney-common/api';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../../classess/http-helper';
import { SLICE_NAME } from './constants';

export const fetchBudgets = createAsyncThunk(
   `${SLICE_NAME}/fetchBudgets`,
   async ({ search }: { search: IBudgetSearchDto }, { getState, rejectWithValue }) => {
      const httpHelper = HttpHelper.forCuurentUser(getState);
      if (!httpHelper) {
         return rejectWithValue('No user session');
      }
      const api = new BudgetApi(httpHelper);

      try {
         return await firstValueFrom(api.list(search).pipe(map((listDto: IBudgetListDto) => listDto.budgets)));
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const deleteBudget = createAsyncThunk(
   `${SLICE_NAME}/deleteBudget`,
   async ({ budgetId }: { budgetId: number }, { getState, rejectWithValue }) => {
      const httpHelper = HttpHelper.forCuurentUser(getState);
      if (!httpHelper) {
         return rejectWithValue('No user session');
      }
      const api = new BudgetApi(httpHelper);

      try {
         return await firstValueFrom(api.delete({ id: budgetId }));
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);
