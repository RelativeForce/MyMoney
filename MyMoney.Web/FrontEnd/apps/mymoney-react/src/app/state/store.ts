import { configureStore } from '@reduxjs/toolkit';
import { IAppState } from './types';
import { reducer as sessionReducer } from './session/slice';
import { reducer as transactionsReducer } from './transactions/slice';
import { reducer as budgetsReducer } from './budgets/slice';
import { reducer as remainingBudgetChartReducer } from './remaining-budget-chart/slice';
import { reducer as runningTotalChartReducer } from './running-total-chart/slice';

export const store = configureStore<IAppState>({
   reducer: {
      session: sessionReducer,
      transactions: transactionsReducer,
      budgets: budgetsReducer,
      remainingBudgetChart: remainingBudgetChartReducer,
      runningTotalChart: runningTotalChartReducer,
   },
});
