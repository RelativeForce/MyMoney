import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
   BudgetApi,
   IBudgetDto,
   IBudgetListDto,
   IBudgetSearchDto,
   IDateRangeDto,
   ITransactionDto,
   ITransactionListDto,
   TransactionApi,
} from '@mymoney-common/api';
import { AsyncStatus, IAsyncState, IRemainingBudgetChartState } from '../types';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../../classess/http-helper';

const SLICE_NAME = 'remainingBudgetChart';

export const initialChartState: IRemainingBudgetChartState = {
   budgets: {
      data: [],
      status: AsyncStatus.empty,
      error: null,
   },
   transactions: {
      data: [],
      status: AsyncStatus.empty,
      error: null,
   },
   searchParameters: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      refresh: true,
   },
};

function toDateRangeDto(search: IBudgetSearchDto): IDateRangeDto {
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

      const dateRangeDto = toDateRangeDto(search);

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

export const remainingBudgetChartSlice = createSlice({
   name: SLICE_NAME,
   initialState: initialChartState,
   reducers: {
      setSelectedMonth: {
         reducer: (state: IRemainingBudgetChartState, { payload }: { payload: IBudgetSearchDto }) => {
            return {
               ...state,
               searchParameters: {
                  ...state.searchParameters,
                  year: payload.year,
                  month: payload.month,
                  refresh: true,
               },
            };
         },
         prepare: (year: number, month: number) => {
            const selectedMonth: IBudgetSearchDto = { year, month };
            return { payload: selectedMonth };
         },
      },
   },
   extraReducers(builder: ActionReducerMapBuilder<IRemainingBudgetChartState>) {
      builder
         .addCase(fetchBudgets.pending, (state: IRemainingBudgetChartState) => {
            return {
               ...state,
               budgets: {
                  data: [],
                  status: AsyncStatus.loading,
                  error: null,
               },
               searchParameters: {
                  ...state.searchParameters,
                  refresh: false,
               },
            };
         })
         .addCase(fetchBudgets.fulfilled, (state: IRemainingBudgetChartState, action: { payload: IBudgetDto[] }) => {
            return {
               ...state,
               budgets: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchBudgets.rejected, (state: IRemainingBudgetChartState, action) => {
            return {
               ...state,
               budgets: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         })
         .addCase(fetchTransactions.pending, (state: IRemainingBudgetChartState, { meta: { arg } }) => {
            return {
               ...state,
               transactions: {
                  data: [],
                  status: AsyncStatus.loading,
                  error: null,
               },
               searchParameters: {
                  ...state.searchParameters,
                  refresh: false,
               },
            };
         })
         .addCase(fetchTransactions.fulfilled, (state: IRemainingBudgetChartState, action: { payload: ITransactionDto[] }) => {
            return {
               ...state,
               transactions: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchTransactions.rejected, (state: IRemainingBudgetChartState, action) => {
            return {
               ...state,
               transactions: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         });
   },
});

export const { setSelectedMonth } = remainingBudgetChartSlice.actions;

export default remainingBudgetChartSlice.reducer;
