import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ITransactionDto } from '@mymoney-common/api';
import { AsyncStatus, ITransactionsState, IDateRangeModel } from '../types';
import { toDateString } from '@mymoney-common/functions';
import { SLICE_NAME } from './constants';
import { deleteRecurringTransaction, deleteTransaction, fetchTransactions } from './thunks';

function defaultDateRange(): IDateRangeModel {
   const end: Date = new Date();

   const start: Date = new Date();
   start.setMonth(start.getMonth() - 1);

   return { end: toDateString(end), start: toDateString(start) };
}

const initialState: ITransactionsState = {
   list: {
      data: [],
      status: AsyncStatus.empty,
      error: null,
   },
   searchParameters: {
      dateRange: defaultDateRange(),
      refresh: true,
   },
};

const transactionsListSlice = createSlice({
   name: SLICE_NAME,
   initialState: initialState,
   reducers: {
      setDataRange: {
         reducer: (state: ITransactionsState, { payload }: { payload: IDateRangeModel }) => {
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
      refreshTransactions: (state: ITransactionsState) => {
         return {
            ...state,
            searchParameters: {
               ...state.searchParameters,
               refresh: true,
            },
         };
      },
   },
   extraReducers(builder: ActionReducerMapBuilder<ITransactionsState>) {
      builder
         .addCase(fetchTransactions.pending, (state: ITransactionsState, { meta: { arg } }) => {
            return {
               ...state,
               list: {
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
         .addCase(fetchTransactions.fulfilled, (state: ITransactionsState, action: { payload: ITransactionDto[] }) => {
            return {
               ...state,
               list: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchTransactions.rejected, (state: ITransactionsState, action) => {
            return {
               ...state,
               list: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         })
         .addCase(deleteTransaction.fulfilled, (state: ITransactionsState, { meta: { arg }, payload }) => {
            if (!payload.success) {
               return state;
            }

            return {
               ...state,
               list: {
                  ...state.list,
                  data: state.list.data.filter((t) => t.id !== arg.transactionId),
               },
            };
         })
         .addCase(deleteRecurringTransaction.fulfilled, (state: ITransactionsState, { meta: { arg }, payload }) => {
            if (!payload.success) {
               return state;
            }

            return {
               ...state,
               list: {
                  ...state.list,
                  data: state.list.data.filter((t) => t.parentId !== arg.recurringTransactionId),
               },
            };
         });
   },
});

export const { setDataRange, refreshTransactions } = transactionsListSlice.actions;

export const reducer = transactionsListSlice.reducer;
