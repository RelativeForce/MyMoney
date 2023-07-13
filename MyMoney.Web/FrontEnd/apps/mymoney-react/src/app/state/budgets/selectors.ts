import { IBudgetDto } from '@mymoney-common/api';
import { IAppState, IBudgetsState, IMonthSearch } from '../types';

export const selectBudgetsListState = (state: IAppState): IBudgetsState => state.budgets;
export const selectBudgets = (state: IAppState): IBudgetDto[] => selectBudgetsListState(state).list.data;
export const selectSearchParameters = (state: IAppState): IMonthSearch => selectBudgetsListState(state).searchParameters;
export function selectBudget(budgetId: number): (state: IAppState) => IBudgetDto | undefined {
   return (state: IAppState): IBudgetDto | undefined => selectBudgets(state).find((budget: IBudgetDto) => budget.id === budgetId);
}
