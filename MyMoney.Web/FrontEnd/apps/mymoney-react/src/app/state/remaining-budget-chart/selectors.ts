import { IBudgetDto, ITransactionDto } from '@mymoney-common/api';
import { IAppState, IAsyncState, IMonthSearch, IRemainingBudgetChartState } from '../types';

export const selectRemainingBudgetChartState = (state: IAppState): IRemainingBudgetChartState => state.remainingBudgetChart;
export const selectSearchParameters = (state: IAppState): IMonthSearch => selectRemainingBudgetChartState(state).searchParameters;
export const selectBudgets = (state: IAppState): IAsyncState<IBudgetDto[]> => selectRemainingBudgetChartState(state).budgets;
export const selectTransactions = (state: IAppState): IAsyncState<ITransactionDto[]> => selectRemainingBudgetChartState(state).transactions;
