import { IAppState } from '../app-state';
import { IIncomeState } from '../reducers';
import { IIncomesSearch, IIncomeModel } from '../types';

export const selectIncomeState = (state: IAppState): IIncomeState => state.incomes;

export const selectIncomes = (state: IAppState): IIncomeModel[] => selectIncomeState(state).incomes;

export const selectIncomesSearchParameters = (state: IAppState): IIncomesSearch => selectIncomeState(state).searchParameters;

export function selectIncome(budgetId: number): (state: IAppState) => IIncomeModel | undefined {
   return (state: IAppState): IIncomeModel | undefined => selectIncomes(state).find((t) => t.id === budgetId);
}
