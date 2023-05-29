import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { IDateRangeDto, ITransactionDto, ITransactionListDto } from 'mymoney-common/lib/api/dtos';
import { IAppState, AsyncStatus, ITransactionState, ITransactionsSearch, IAsyncState, IDateRangeModel } from './types';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { TransactionApi } from 'mymoney-common/lib/api';
import { HttpHelper } from '@/classess/http-helper';
import { toDateString } from 'mymoney-common/lib/functions';

function defaultDateRange(): IDateRangeModel {
   const end: Date = new Date();

   const start: Date = new Date();
   start.setMonth(start.getMonth() - 1);

   return { end: toDateString(end), start: toDateString(start) };
}

export const initialTransactionListState: IAsyncState<ITransactionDto[]> = {
   data: [],
   status: AsyncStatus.empty,
   error: null,
};

export const initialTransactionsState: ITransactionState = {
   transactions: initialTransactionListState,
   searchParameters: {
      dateRange: defaultDateRange(),
      refresh: true,
   }
};

export interface IFetchTransactionsRequest {
   sessionToken: string;
   dateRange: IDateRangeModel;
}

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async ({ sessionToken, dateRange }: IFetchTransactionsRequest) => {
   const dateRangeDto: IDateRangeDto = {
      start: new Date(dateRange.start),
      end: new Date(dateRange.end)
   }

   const httpHelper = new HttpHelper(sessionToken);
   const api = new TransactionApi(httpHelper);

   try {
      return await firstValueFrom(api.list(dateRangeDto).pipe(first(), map((listDto: ITransactionListDto) => listDto.transactions)));
   } catch (error: any) {
      return error.message;
   }
});

export interface IDeleteTransactionRequest {
   sessionToken: string;
   transactionId: number;
}

export const deleteTransaction = createAsyncThunk('transactions/deleteTransaction', async ({ sessionToken, transactionId }: IDeleteTransactionRequest) => {
   const httpHelper = new HttpHelper(sessionToken);
   const api = new TransactionApi(httpHelper);

   try {
      return await firstValueFrom(api.delete({ id: transactionId }).pipe(first()));
   } catch (error: any) {
      return error.message;
   }
});

export interface IDeleteRecurringTransactionRequest {
   sessionToken: string;
   recurringTransactionId: number;
}

export const deleteRecurringTransaction = createAsyncThunk('transactions/deleteRecurringTransaction', async ({ sessionToken, recurringTransactionId }: IDeleteRecurringTransactionRequest) => {
   const httpHelper = new HttpHelper(sessionToken);
   const api = new TransactionApi(httpHelper);

   try {
      return await firstValueFrom(api.deleteRecurring({ id: recurringTransactionId }).pipe(first()));
   } catch (error: any) {
      return error.message;
   }
});

export const transactionsSlice = createSlice({
   name: 'transactions',
   initialState: initialTransactionsState,
   reducers: {
      setDataRange: {
         reducer: (state: ITransactionState, { payload }: { payload: IDateRangeModel }) => {
            return {
               ...state,
               searchParameters: {
                  ...state.searchParameters,
                  dateRange: payload,
                  refresh: true
               }
            };
         },
         prepare: (start: string, end: string) => {
            const dateRange: IDateRangeModel = { start, end };
            return { payload: dateRange };
         }
      },
      refreshTransactions: (state: ITransactionState) => {
         return {
            ...state,
            searchParameters: {
               ...state.searchParameters,
               refresh: true
            }
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
                  refresh: false
               }
            };
         })
         .addCase(fetchTransactions.fulfilled, (state: ITransactionState, action: { payload: ITransactionDto[] }) => {
            return {
               ...state,
               transactions: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               }
            };
         })
         .addCase(fetchTransactions.rejected, (state: ITransactionState, action) => {
            return {
               ...state,
               transactions: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               }
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
                  data: state.transactions.data.filter(t => t.id !== arg.transactionId),
               }
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
                  data: state.transactions.data.filter(t => t.parentId !== arg.recurringTransactionId),
               }
            };
         });
   }
});

export const { setDataRange, refreshTransactions } = transactionsSlice.actions;

export const selectTransactionState = (state: IAppState): ITransactionState => state.transactions;

export const selectTransactions = (state: IAppState): ITransactionDto[] => selectTransactionState(state).transactions.data;

export const selectTransactionsSearchParameters = (state: IAppState): ITransactionsSearch => selectTransactionState(state).searchParameters;

export const selectTransactionsDateRange = (state: IAppState): IDateRangeModel => selectTransactionsSearchParameters(state).dateRange;

export function selectTransaction(transactionId: number): (state: IAppState) => ITransactionDto | undefined {
   return (state: IAppState): ITransactionDto | undefined => selectTransactions(state).find((t) => t.id === transactionId);
}


export default transactionsSlice.reducer;
