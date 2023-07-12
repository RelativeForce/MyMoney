import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { TransactionApi, IDateRangeDto, ITransactionDto, ITransactionListDto } from '@mymoney-common/api';
import { AsyncStatus, ITransactionState, IDateRangeModel } from '../types';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { toDateString } from '@mymoney-common/functions';
import { HttpHelper } from '../../classess/http-helper';

const SLICE_NAME = 'transactionsList';

function defaultDateRange(): IDateRangeModel {
   const end: Date = new Date();

   const start: Date = new Date();
   start.setMonth(start.getMonth() - 1);

   return { end: toDateString(end), start: toDateString(start) };
}

export const initialTransactionsState: ITransactionState = {
   transactions: {
      data: [],
      status: AsyncStatus.empty,
      error: null,
   },
   searchParameters: {
      dateRange: defaultDateRange(),
      refresh: true,
   },
};

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

export const transactionsSlice = createSlice({
   name: SLICE_NAME,
   initialState: initialTransactionsState,
   reducers: {
      setDataRange: {
         reducer: (state: ITransactionState, { payload }: { payload: IDateRangeModel }) => {
            return {
               ...state,
               searchParameters: {
                  ...state.searchParameters,
                  dateRange: payload,
                  refresh: true,
               },
            };
         },
         prepare: (start: string, end: string) => {
            const dateRange: IDateRangeModel = { start, end };
            return { payload: dateRange };
         },
      },
      refreshTransactions: (state: ITransactionState) => {
         return {
            ...state,
            searchParameters: {
               ...state.searchParameters,
               refresh: true,
            },
         };
      },
   },
   extraReducers(builder: ActionReducerMapBuilder<ITransactionState>) {
      builder
         .addCase(fetchTransactions.pending, (state: ITransactionState, { meta: { arg } }) => {
            return {
               ...state,
               transactions: {
                  data: [],
                  status: AsyncStatus.loading,
                  error: null,
               },
               searchParameters: {
                  dateRange: arg.dateRange,
                  refresh: false,
               },
            };
         })
         .addCase(fetchTransactions.fulfilled, (state: ITransactionState, action: { payload: ITransactionDto[] }) => {
            return {
               ...state,
               transactions: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchTransactions.rejected, (state: ITransactionState, action) => {
            return {
               ...state,
               transactions: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         })
         .addCase(deleteTransaction.fulfilled, (state: ITransactionState, { meta: { arg }, payload }) => {
            if (!payload.success) {
               return state;
            }

            return {
               ...state,
               transactions: {
                  ...state.transactions,
                  data: state.transactions.data.filter((t) => t.id !== arg.transactionId),
               },
            };
         })
         .addCase(deleteRecurringTransaction.fulfilled, (state: ITransactionState, { meta: { arg }, payload }) => {
            if (!payload.success) {
               return state;
            }

            return {
               ...state,
               transactions: {
                  ...state.transactions,
                  data: state.transactions.data.filter((t) => t.parentId !== arg.recurringTransactionId),
               },
            };
         });
   },
});

export const { setDataRange, refreshTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
