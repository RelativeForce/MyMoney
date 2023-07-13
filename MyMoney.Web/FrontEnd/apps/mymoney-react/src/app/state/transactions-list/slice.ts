import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ITransactionDto } from '@mymoney-common/api';
import { AsyncStatus, ITransactionState, IDateRangeModel } from '../types';
import { toDateString } from '@mymoney-common/functions';
import { SLICE_NAME } from './constants';
import { deleteRecurringTransaction, deleteTransaction, fetchTransactions } from './thunks';

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
