import { Action } from '@ngrx/store';
import {
   SetIncomesAction,
   UpdateIncomeAction,
   IncomeActionTypes,
   DeleteIncomeAction,
   UpdateSearchDateAction
} from '../actions';
import { IDateRangeModel, IIncomeModel, IIncomesSearch } from '../types';

export interface IIncomeState {
   incomes: IIncomeModel[];
   searchParameters: IIncomesSearch;
}

export const initialIncomeState: IIncomeState = {
   incomes: [],
   searchParameters: {
      dateRange: defaultDateRange(),
      refresh: true,
   }
};

export function incomeReducer(state: IIncomeState = initialIncomeState, action: Action): IIncomeState {
   switch (action.type) {
      case IncomeActionTypes.SetIncomes:
         return setIncomes(state, action as SetIncomesAction);
      case IncomeActionTypes.UpdateIncome:
         return updateIncome(state, action as UpdateIncomeAction);
      case IncomeActionTypes.DeleteIncome:
         return deleteIncome(state, action as DeleteIncomeAction);
      case IncomeActionTypes.UpdateSearchDate:
         return updateSelectedSearchDate(state, action as UpdateSearchDateAction);
      case IncomeActionTypes.RefreshIncomes:
         return refreshIncomes(state);
      default:
         return state;
   }
}

function setIncomes(state: IIncomeState, action: SetIncomesAction): IIncomeState {
   const incomes: IIncomeModel[] = action.incomes;

   return {
      ...state,
      incomes: incomes,
      searchParameters: {
         ...state.searchParameters,
         refresh: false
      }
   };
}

function refreshIncomes(state: IIncomeState): IIncomeState {
   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         refresh: true
      }
   };
}

function updateIncome(state: IIncomeState, action: UpdateIncomeAction): IIncomeState {
   const income: IIncomeModel = action.income;

   const index = state.incomes.findIndex(t => t.id === income.id);

   const incomes = state.incomes.map(t => t);

   incomes[index] = income;

   return {
      ...state,
      incomes: incomes
   };
}

function deleteIncome(state: IIncomeState, action: DeleteIncomeAction): IIncomeState {
   const incomeId: number = action.incomeId;

   const index = state.incomes.findIndex(t => t.id === incomeId);

   const incomes = state.incomes.map(t => t);

   incomes.splice(index, 1);

   return {
      ...state,
      incomes: incomes
   };
}

function updateSelectedSearchDate(state: IIncomeState, action: UpdateSearchDateAction): IIncomeState {
   const dateRange: IDateRangeModel = action.dateRange;

   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         dateRange,
         refresh: true
      }
   };
}

function defaultDateRange(): IDateRangeModel {
   const end: Date = new Date();

   const start: Date = new Date();
   start.setMonth(start.getMonth() - 1);

   return { end, start };
}
