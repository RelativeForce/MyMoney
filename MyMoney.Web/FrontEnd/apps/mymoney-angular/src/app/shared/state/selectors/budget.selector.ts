import { IAppState } from '../app-state';
import { IBudgetState } from '../reducers';
import { IBudgetsSearch, IBudgetModel } from '../types';

export const selectBudgetState = (state: IAppState): IBudgetState =>
   state.budgets;

export const selectBudgets = (state: IAppState): IBudgetModel[] =>
   selectBudgetState(state).budgets;

export const selectBudgetsSearchParameters = (
   state: IAppState
): IBudgetsSearch => selectBudgetState(state).searchParameters;

export function selectBudget(
   budgetId: number
): (state: IAppState) => IBudgetModel | undefined {
   return (state: IAppState): IBudgetModel | undefined =>
      selectBudgets(state).find((t) => t.id === budgetId);
}
