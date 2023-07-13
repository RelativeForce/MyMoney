import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { IBudgetDto, IBudgetSearchDto, ITransactionDto } from '@mymoney-common/api';
import { AsyncStatus, IRemainingBudgetChartState } from '../types';
import { SLICE_NAME } from './constants';
import { fetchBudgets, fetchTransactions } from './thunks';

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
