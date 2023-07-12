import {
   createSlice,
   createAsyncThunk,
   ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import {
   HomeApi,
   IDateRangeDto,
   IRunningTotalDto,
   IRunningTotalListDto,
} from '@mymoney-common/api';
import {
   IAppState,
   AsyncStatus,
   IYearSearch,
   IAsyncState,
   IRunningTotalChartState,
} from './types';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../classess/http-helper';

export const initialRunningTotalListState: IAsyncState<IRunningTotalDto[]> = {
   data: [],
   status: AsyncStatus.empty,
   error: null,
};

export const initialChartState: IRunningTotalChartState = {
   runningTotals: initialRunningTotalListState,
   searchParameters: {
      year: new Date().getFullYear(),
      refresh: true,
   },
};

function toDateRangeDto(year: number): IDateRangeDto {
   const end: Date = new Date();
   end.setDate(1);
   end.setMonth(0);
   end.setFullYear(year + 1);
   end.setHours(0, 0, 0, 0);
   end.setDate(0); // Subtract 1 day

   const start: Date = new Date();
   start.setDate(1);
   start.setFullYear(year);
   start.setMonth(0);
   start.setHours(0, 0, 0, 0);

   return { end, start };
}

export const fetchRunningTotals = createAsyncThunk(
   'runningTotalChart/fetchRunningTotals',
   async (year: number, { getState, rejectWithValue }) => {
      const state = getState() as IAppState;
      if (!state.session.currentSession?.token) {
         return rejectWithValue('No user session');
      }

      const dateRange = toDateRangeDto(year);

      const httpHelper = new HttpHelper(state.session.currentSession.token);
      const api = new HomeApi(httpHelper);

      try {
         return await firstValueFrom(
            api.runningTotal({ initialTotal: 0, dateRange }).pipe(
               first(),
               map((listDto: IRunningTotalListDto) => listDto.runningTotals)
            )
         );
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const runningTotalChartSlice = createSlice({
   name: 'runningTotalChart',
   initialState: initialChartState,
   reducers: {
      setSelectedYear: {
         reducer: (
            state: IRunningTotalChartState,
            { payload }: { payload: number }
         ) => {
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
         .addCase(
            fetchRunningTotals.pending,
            (state: IRunningTotalChartState) => {
               return {
                  ...state,
                  runningTotals: {
                     data: [],
                     status: AsyncStatus.loading,
                     error: null,
                  },
               };
            }
         )
         .addCase(
            fetchRunningTotals.fulfilled,
            (
               state: IRunningTotalChartState,
               action: { payload: IRunningTotalDto[] }
            ) => {
               return {
                  ...state,
                  runningTotals: {
                     data: action.payload,
                     status: AsyncStatus.succeeded,
                     error: null,
                  },
                  searchParameters: {
                     ...state.searchParameters,
                     refresh: false,
                  },
               };
            }
         )
         .addCase(
            fetchRunningTotals.rejected,
            (state: IRunningTotalChartState, action) => {
               return {
                  ...state,
                  runningTotals: {
                     data: [],
                     status: AsyncStatus.failed,
                     error: action.error.message ?? null,
                  },
                  searchParameters: {
                     ...state.searchParameters,
                     refresh: false,
                  },
               };
            }
         );
   },
});

export const { setSelectedYear } = runningTotalChartSlice.actions;

export const selectRunningTotalChartStateState = (
   state: IAppState
): IRunningTotalChartState => state.runningTotalChart;
export const selectRemainingBudgetSearchParameters = (
   state: IAppState
): IYearSearch => selectRunningTotalChartStateState(state).searchParameters;
export const selectChartRunningTotals = (state: IAppState) =>
   selectRunningTotalChartStateState(state).runningTotals;

export default runningTotalChartSlice.reducer;
