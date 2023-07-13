import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { IBudgetDto, IBudgetSearchDto } from '@mymoney-common/api';
import { AsyncStatus, IBudgetsState } from '../types';
import { SLICE_NAME } from './constants';
import { deleteBudget, fetchBudgets } from './thunks';

const initialState: IBudgetsState = {
   list: {
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

const slice = createSlice({
   name: SLICE_NAME,
   initialState: initialState,
   reducers: {
      setSelectedMonth: {
         reducer: (state: IBudgetsState, { payload }: { payload: IBudgetSearchDto }) => {
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
      refreshBudgets: (state: IBudgetsState) => {
         return {
            ...state,
            searchParameters: {
               ...state.searchParameters,
               refresh: true,
            },
         };
      },
   },
   extraReducers(builder: ActionReducerMapBuilder<IBudgetsState>) {
      builder
         .addCase(fetchBudgets.pending, (state: IBudgetsState, { meta: { arg } }) => {
            return {
               ...state,
               list: {
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
         .addCase(fetchBudgets.fulfilled, (state: IBudgetsState, action: { payload: IBudgetDto[] }) => {
            return {
               ...state,
               list: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchBudgets.rejected, (state: IBudgetsState, action) => {
            return {
               ...state,
               list: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         })
         .addCase(deleteBudget.fulfilled, (state: IBudgetsState, { meta: { arg }, payload }) => {
            if (!payload.success) {
               return state;
            }

            return {
               ...state,
               list: {
                  ...state.list,
                  data: state.list.data.filter((t) => t.id !== arg.budgetId),
               },
            };
         });
   },
});

export const { setSelectedMonth, refreshBudgets } = slice.actions;

export const reducer = slice.reducer;
