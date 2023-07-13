import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { IBudgetDto, IBudgetSearchDto } from '@mymoney-common/api';
import { AsyncStatus, IBudgetState } from '../types';
import { SLICE_NAME } from './constants';
import { deleteBudget, fetchBudgets } from './thunks';

export const initialBudgetsState: IBudgetState = {
   budgets: {
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

export const budgetsSlice = createSlice({
   name: SLICE_NAME,
   initialState: initialBudgetsState,
   reducers: {
      setSelectedMonth: {
         reducer: (state: IBudgetState, { payload }: { payload: IBudgetSearchDto }) => {
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
      refreshBudgets: (state: IBudgetState) => {
         return {
            ...state,
            searchParameters: {
               ...state.searchParameters,
               refresh: true,
            },
         };
      },
   },
   extraReducers(builder: ActionReducerMapBuilder<IBudgetState>) {
      builder
         .addCase(fetchBudgets.pending, (state: IBudgetState, { meta: { arg } }) => {
            return {
               ...state,
               budgets: {
                  data: [],
                  status: AsyncStatus.loading,
                  error: null,
               },
               searchParameters: {
                  month: arg.search.month,
                  year: arg.search.year,
                  refresh: false,
               },
            };
         })
         .addCase(fetchBudgets.fulfilled, (state: IBudgetState, action: { payload: IBudgetDto[] }) => {
            return {
               ...state,
               budgets: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchBudgets.rejected, (state: IBudgetState, action) => {
            return {
               ...state,
               budgets: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         })
         .addCase(deleteBudget.fulfilled, (state: IBudgetState, { meta: { arg }, payload }) => {
            if (!payload.success) {
               return state;
            }

            return {
               ...state,
               budgets: {
                  ...state.budgets,
                  data: state.budgets.data.filter((t) => t.id !== arg.budgetId),
               },
            };
         });
   },
});

export const { setSelectedMonth, refreshBudgets } = budgetsSlice.actions;

export default budgetsSlice.reducer;
