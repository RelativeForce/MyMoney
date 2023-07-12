import {
   createSlice,
   createAsyncThunk,
   ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
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
import {
   IAppState,
   AsyncStatus,
   IBudgetsSearch,
   IAsyncState,
   IRemainingBudgetChartState,
} from './types';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../classess/http-helper';

export const initialBudgetListState: IAsyncState<IBudgetDto[]> = {
   data: [],
   status: AsyncStatus.empty,
   error: null,
};

export const initialTransactionListState: IAsyncState<ITransactionDto[]> = {
   data: [],
   status: AsyncStatus.empty,
   error: null,
};

export const initialChartState: IRemainingBudgetChartState = {
   budgets: initialBudgetListState,
   transactions: initialTransactionListState,
   searchParameters: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      refresh: true,
   },
};

function isPopulated<T>(state: IAsyncState<T>) {
   return (
      state.status !== AsyncStatus.empty && state.status !== AsyncStatus.loading
   );
}

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

export const fetchChartBudgets = createAsyncThunk(
   'remainingBudgetChart/fetchBudgets',
   async (
      { search }: { search: IBudgetSearchDto },
      { getState, rejectWithValue }
   ) => {
      const state = getState() as IAppState;
      if (!state.session.currentSession?.token) {
         return rejectWithValue('No user session');
      }

      const httpHelper = new HttpHelper(state.session.currentSession.token);
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

export const fetchChartTransactions = createAsyncThunk(
   'remainingBudgetChart/fetchTransactions',
   async (
      { search }: { search: IBudgetSearchDto },
      { getState, rejectWithValue }
   ) => {
      const state = getState() as IAppState;
      if (!state.session.currentSession?.token) {
         return rejectWithValue('No user session');
      }

      const httpHelper = new HttpHelper(state.session.currentSession.token);
      const api = new TransactionApi(httpHelper);

      const dateRangeDto = toDateRangeDto(search);

      try {
         return await firstValueFrom(
            api.list(dateRangeDto).pipe(
               first(),
               map((listDto: ITransactionListDto) =>
                  listDto.transactions.reverse()
               )
            )
         );
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const remainingBudgetChartSlice = createSlice({
   name: 'remainingBudgetChart',
   initialState: initialChartState,
   reducers: {
      setSelectedMonth: {
         reducer: (
            state: IRemainingBudgetChartState,
            { payload }: { payload: IBudgetSearchDto }
         ) => {
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
         .addCase(
            fetchChartBudgets.pending,
            (state: IRemainingBudgetChartState) => {
               return {
                  ...state,
                  budgets: {
                     data: [],
                     status: AsyncStatus.loading,
                     error: null,
                  },
               };
            }
         )
         .addCase(
            fetchChartBudgets.fulfilled,
            (
               state: IRemainingBudgetChartState,
               action: { payload: IBudgetDto[] }
            ) => {
               return {
                  ...state,
                  budgets: {
                     data: action.payload,
                     status: AsyncStatus.succeeded,
                     error: null,
                  },
                  searchParameters: {
                     ...state.searchParameters,
                     refresh: !isPopulated(state.transactions),
                  },
               };
            }
         )
         .addCase(
            fetchChartBudgets.rejected,
            (state: IRemainingBudgetChartState, action) => {
               return {
                  ...state,
                  budgets: {
                     data: [],
                     status: AsyncStatus.failed,
                     error: action.error.message ?? null,
                  },
                  searchParameters: {
                     ...state.searchParameters,
                     refresh: !isPopulated(state.transactions),
                  },
               };
            }
         )
         .addCase(
            fetchChartTransactions.pending,
            (state: IRemainingBudgetChartState, { meta: { arg } }) => {
               return {
                  ...state,
                  transactions: {
                     data: [],
                     status: AsyncStatus.loading,
                     error: null,
                  },
               };
            }
         )
         .addCase(
            fetchChartTransactions.fulfilled,
            (
               state: IRemainingBudgetChartState,
               action: { payload: ITransactionDto[] }
            ) => {
               return {
                  ...state,
                  transactions: {
                     data: action.payload,
                     status: AsyncStatus.succeeded,
                     error: null,
                  },
                  searchParameters: {
                     ...state.searchParameters,
                     refresh: !isPopulated(state.budgets),
                  },
               };
            }
         )
         .addCase(
            fetchChartTransactions.rejected,
            (state: IRemainingBudgetChartState, action) => {
               return {
                  ...state,
                  transactions: {
                     data: [],
                     status: AsyncStatus.failed,
                     error: action.error.message ?? null,
                  },
                  searchParameters: {
                     ...state.searchParameters,
                     refresh: !isPopulated(state.budgets),
                  },
               };
            }
         );
   },
});

export const { setSelectedMonth } = remainingBudgetChartSlice.actions;

export const selectRemainingBudgetChartState = (
   state: IAppState
): IRemainingBudgetChartState => state.remainingBudgetChart;
export const selectRemainingBudgetSearchParameters = (
   state: IAppState
): IBudgetsSearch => selectRemainingBudgetChartState(state).searchParameters;
export const selectChartBudgets = (state: IAppState) =>
   selectRemainingBudgetChartState(state).budgets;
export const selectChartTransactions = (state: IAppState) =>
   selectRemainingBudgetChartState(state).transactions;

export default remainingBudgetChartSlice.reducer;
