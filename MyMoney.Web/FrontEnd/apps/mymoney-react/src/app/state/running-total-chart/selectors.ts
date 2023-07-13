import { IRunningTotalDto } from '@mymoney-common/api';
import { IAppState, IYearSearch, IAsyncState, IRunningTotalChartState } from '../types';

export const selectRunningTotalChartState = (state: IAppState): IRunningTotalChartState => state.runningTotalChart;
export const selectSearchParameters = (state: IAppState): IYearSearch => selectRunningTotalChartState(state).searchParameters;
export const selectRunningTotals = (state: IAppState): IAsyncState<IRunningTotalDto[]> => selectRunningTotalChartState(state).runningTotals;
