import { Action } from '@ngrx/store';
import { SetBudgetsAction, UpdateBudgetAction, BudgetActionTypes, DeleteBudgetAction, UpdateSearchMonthIdAction } from '../actions';
import { IBudgetModel, IBudgetsSearch } from '../types';

function setBudgets(state: IBudgetState, action: SetBudgetsAction): IBudgetState {
   const budgets: IBudgetModel[] = action.budgets;

   return {
      ...state,
      budgets: budgets,
      searchParameters: {
         ...state.searchParameters,
         refresh: false,
      },
   };
}

function refreshBudgets(state: IBudgetState): IBudgetState {
   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         refresh: true,
      },
   };
}

function updateBudget(state: IBudgetState, action: UpdateBudgetAction): IBudgetState {
   const budget: IBudgetModel = action.budget;

   const index = state.budgets.findIndex((t) => t.id === budget.id);

   const budgets = state.budgets.map((t) => t);

   budgets[index] = budget;

   return {
      ...state,
      budgets,
   };
}

function deleteBudget(state: IBudgetState, action: DeleteBudgetAction): IBudgetState {
   const budgetId: number = action.budgetId;

   const index = state.budgets.findIndex((t) => t.id === budgetId);

   const budgets = state.budgets.map((t) => t);

   budgets.splice(index, 1);

   return {
      ...state,
      budgets: budgets,
   };
}

function updateSelectedMonth(state: IBudgetState, action: UpdateSearchMonthIdAction): IBudgetState {
   const month: number = action.month;
   const year: number = action.year;

   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         month,
         year,
         refresh: true,
      },
   };
}

export interface IBudgetState {
   budgets: IBudgetModel[];
   searchParameters: IBudgetsSearch;
}

export const initialBudgetState: IBudgetState = {
   budgets: [],
   searchParameters: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      refresh: true,
   },
};

export function budgetReducer(state: IBudgetState = initialBudgetState, action: Action): IBudgetState {
   switch (action.type) {
      case BudgetActionTypes.setBudgets:
         return setBudgets(state, action as SetBudgetsAction);
      case BudgetActionTypes.updateBudget:
         return updateBudget(state, action as UpdateBudgetAction);
      case BudgetActionTypes.deleteBudget:
         return deleteBudget(state, action as DeleteBudgetAction);
      case BudgetActionTypes.updateMonthId:
         return updateSelectedMonth(state, action as UpdateSearchMonthIdAction);
      case BudgetActionTypes.refreshBudgets:
         return refreshBudgets(state);
      default:
         return state;
   }
}
