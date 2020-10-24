import { Action } from '@ngrx/store';
import {
   SetBudgetsAction,
   UpdateBudgetAction,
   BudgetActionTypes,
   DeleteBudgetAction,
   UpdateSearchMonthIdAction
} from '../actions';
import { IBudgetModel, IBudgetsSearch } from '../types';

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
   }
};

export function budgetReducer(state: IBudgetState = initialBudgetState, action: Action): IBudgetState {
   switch (action.type) {
      case BudgetActionTypes.SetBudgets:
         return SetBudgets(state, action as SetBudgetsAction);
      case BudgetActionTypes.UpdateBudget:
         return UpdateBudget(state, action as UpdateBudgetAction);
      case BudgetActionTypes.DeleteBudget:
         return DeleteBudget(state, action as DeleteBudgetAction);
      case BudgetActionTypes.UpdateMonthId:
         return UpdateDataRange(state, action as UpdateSearchMonthIdAction);
      case BudgetActionTypes.RefreshBudgets:
         return RefreshBudgets(state);
      default:
         return state;
   }
}

function SetBudgets(state: IBudgetState, action: SetBudgetsAction): IBudgetState {
   const budgets: IBudgetModel[] = action.budgets;

   return {
      ...state,
      budgets: budgets,
      searchParameters: {
         ...state.searchParameters,
         refresh: false
      }
   };
}

function RefreshBudgets(state: IBudgetState): IBudgetState {
   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         refresh: true
      }
   };
}

function UpdateBudget(state: IBudgetState, action: UpdateBudgetAction): IBudgetState {
   const budget: IBudgetModel = action.budget;

   const index = state.budgets.findIndex(t => t.id === budget.id);

   const budgets = state.budgets.map(t => t);

   budgets[index] = budget;

   return {
      ...state,
      budgets
   };
}

function DeleteBudget(state: IBudgetState, action: DeleteBudgetAction): IBudgetState {
   const budgetId: number = action.budgetId;

   const index = state.budgets.findIndex(t => t.id === budgetId);

   const budgets = state.budgets.map(t => t);

   budgets.splice(index, 1);

   return {
      ...state,
      budgets: budgets
   };
}

function UpdateDataRange(state: IBudgetState, action: UpdateSearchMonthIdAction): IBudgetState {
   const month: number = action.month;
   const year: number = action.year;

   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         month,
         year,
         refresh: true
      }
   };
}
