import { configureStore } from '@reduxjs/toolkit';
import { IAppState } from './types';
import sessionReducer from './session/slice';
import transactionsReducer from './transactions-list/slice';
import budgetsReducer from './budgets-list/slice';
import remainingBudgetChartReducer from './remaining-budget-chart/slice';
import runningTotalChartReducer from './running-total-chart/slice';

export const store = configureStore<IAppState>({
   reducer: {
      session: sessionReducer,
      transactions: transactionsReducer,
      budgets: budgetsReducer,
      remainingBudgetChart: remainingBudgetChartReducer,
      runningTotalChart: runningTotalChartReducer,
   },
});
