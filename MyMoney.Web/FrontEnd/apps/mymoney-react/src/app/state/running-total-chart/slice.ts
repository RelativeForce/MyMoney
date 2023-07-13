import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { IRunningTotalDto } from '@mymoney-common/api';
import { AsyncStatus, IRunningTotalChartState } from '../types';
import { SLICE_NAME } from './constants';
import { fetchRunningTotals } from './thunks';

const initialState: IRunningTotalChartState = {
   runningTotals: {
      data: [],
      status: AsyncStatus.empty,
      error: null,
   },
   searchParameters: {
      year: new Date().getFullYear(),
      refresh: true,
   },
};

const slice = createSlice({
   name: SLICE_NAME,
   initialState: initialState,
   reducers: {
      setSelectedYear: {
         reducer: (state: IRunningTotalChartState, { payload }: { payload: number }) => {
            return {
               ...state,
               searchParameters: {
                  ...state.searchParameters,
                  year: payload,
                  refresh: true,
               },
            };
         },
         prepare: (year: number) => {
            return { payload: year };
         },
      },
   },
   extraReducers(builder: ActionReducerMapBuilder<IRunningTotalChartState>) {
      builder
         .addCase(fetchRunningTotals.pending, (state: IRunningTotalChartState) => {
            return {
               ...state,
               runningTotals: {
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
         .addCase(fetchRunningTotals.fulfilled, (state: IRunningTotalChartState, action: { payload: IRunningTotalDto[] }) => {
            return {
               ...state,
               runningTotals: {
                  data: action.payload,
                  status: AsyncStatus.succeeded,
                  error: null,
               },
            };
         })
         .addCase(fetchRunningTotals.rejected, (state: IRunningTotalChartState, action) => {
            return {
               ...state,
               runningTotals: {
                  data: [],
                  status: AsyncStatus.failed,
                  error: action.error.message ?? null,
               },
            };
         });
   },
});

export const { setSelectedYear } = slice.actions;

export const reducer = slice.reducer;
