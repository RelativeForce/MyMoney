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
} from '@mymoney-common/api';
import {
   IAppState,
   AsyncStatus,
   IBudgetState,
   IBudgetsSearch,
   IAsyncState,
} from './types';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../classess/http-helper';

export const initialBudgetListState: IAsyncState<IBudgetDto[]> = {
   data: [],
   status: AsyncStatus.empty,
   error: null,
};

export const initialBudgetsState: IBudgetState = {
   budgets: initialBudgetListState,
   searchParameters: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      refresh: true,
   },
};

export const fetchBudgets = createAsyncThunk(
   'budgets/fetchBudgets',
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

export interface IDeleteBudgetRequest {
   sessionToken: string;
   budgetId: number;
}

export const deleteBudget = createAsyncThunk(
   'budgets/deleteBudget',
   async (
      { budgetId }: { budgetId: number },
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
            api.delete({ id: budgetId }).pipe(first())
         );
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const budgetsSlice = createSlice({
   name: 'budgets',
   initialState: initialBudgetsState,
   reducers: {
      setSelectedMonth: {
         reducer: (
            state: IBudgetState,
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
         .addCase(
            fetchBudgets.pending,
            (state: IBudgetState, { meta: { arg } }) => {
               return {
                  ...state,
                  budgets: {
                     data: [],
                     status: AsyncStatus.loading,
                     error: null,
                  },
                  searchParameters: {
                     month: arg.search.month,
                     year: arg.search.month,
                     refresh: false,
                  },
               };
            }
         )
         .addCase(
            fetchBudgets.fulfilled,
            (state: IBudgetState, action: { payload: IBudgetDto[] }) => {
               return {
                  ...state,
                  budgets: {
                     data: action.payload,
                     status: AsyncStatus.succeeded,
                     error: null,
                  },
               };
            }
         )
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
         .addCase(
            deleteBudget.fulfilled,
            (state: IBudgetState, { meta: { arg }, payload }) => {
               if (!payload.success) {
                  return state;
               }

               return {
                  ...state,
                  budgets: {
                     ...state.budgets,
                     data: state.budgets.data.filter(
                        (t) => t.id !== arg.budgetId
                     ),
                  },
               };
            }
         );
   },
});

export const { setSelectedMonth, refreshBudgets } = budgetsSlice.actions;

export const selectBudgetState = (state: IAppState): IBudgetState =>
   state.budgets;

export const selectBudgets = (state: IAppState): IBudgetDto[] =>
   selectBudgetState(state).budgets.data;

export const selectBudgetsSearchParameters = (
   state: IAppState
): IBudgetsSearch => selectBudgetState(state).searchParameters;

export function selectBudget(
   budgetId: number
): (state: IAppState) => IBudgetDto | undefined {
   return (state: IAppState): IBudgetDto | undefined =>
      selectBudgets(state).find((t) => t.id === budgetId);
}

export default budgetsSlice.reducer;
