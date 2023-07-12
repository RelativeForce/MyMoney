import { IBudgetDto } from '@mymoney-common/api';
import { IAppState, IBudgetState, IMonthSearch } from '../types';

export const selectBudgetsListState = (state: IAppState): IBudgetState => state.budgets;
export const selectBudgets = (state: IAppState): IBudgetDto[] => selectBudgetsListState(state).budgets.data;
export const selectSearchParameters = (state: IAppState): IMonthSearch => selectBudgetsListState(state).searchParameters;
export function selectBudget(budgetId: number): (state: IAppState) => IBudgetDto | undefined {
   return (state: IAppState): IBudgetDto | undefined => selectBudgets(state).find((budget: IBudgetDto) => budget.id === budgetId);
}
