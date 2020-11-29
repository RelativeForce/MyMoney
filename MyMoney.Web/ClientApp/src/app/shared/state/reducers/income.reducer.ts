import { Action } from '@ngrx/store';
import {
   SetIncomesAction,
   UpdateIncomeAction,
   IncomeActionTypes,
   DeleteIncomeAction,
   UpdateSearchDateAction
} from '../actions';
import { IIncomeModel, IIncomesSearch } from '../types';

export interface IIncomeState {
   incomes: IIncomeModel[];
   searchParameters: IIncomesSearch;
}

export const initialIncomeState: IIncomeState = {
   incomes: [],
   searchParameters: {
      count: 20,
      date: new Date(),
      refresh: true,
   }
};

export function incomeReducer(state: IIncomeState = initialIncomeState, action: Action): IIncomeState {
   switch (action.type) {
      case IncomeActionTypes.SetIncomes:
         return SetIncomes(state, action as SetIncomesAction);
      case IncomeActionTypes.UpdateIncome:
         return UpdateIncome(state, action as UpdateIncomeAction);
      case IncomeActionTypes.DeleteIncome:
         return DeleteIncome(state, action as DeleteIncomeAction);
      case IncomeActionTypes.UpdateSearchDate:
         return UpdateSelectedSearchDate(state, action as UpdateSearchDateAction);
      case IncomeActionTypes.RefreshIncomes:
         return RefreshIncomes(state);
      default:
         return state;
   }
}

function SetIncomes(state: IIncomeState, action: SetIncomesAction): IIncomeState {
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

function RefreshIncomes(state: IIncomeState): IIncomeState {
   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         refresh: true
      }
   };
}

function UpdateIncome(state: IIncomeState, action: UpdateIncomeAction): IIncomeState {
   const income: IIncomeModel = action.income;

   const index = state.incomes.findIndex(t => t.id === income.id);

   const incomes = state.incomes.map(t => t);

   incomes[index] = income;

   return {
      ...state,
      incomes: incomes
   };
}

function DeleteIncome(state: IIncomeState, action: DeleteIncomeAction): IIncomeState {
   const incomeId: number = action.incomeId;

   const index = state.incomes.findIndex(t => t.id === incomeId);

   const incomes = state.incomes.map(t => t);

   incomes.splice(index, 1);

   return {
      ...state,
      incomes: incomes
   };
}

function UpdateSelectedSearchDate(state: IIncomeState, action: UpdateSearchDateAction): IIncomeState {
   const date: Date = action.date;

   return {
      ...state,
      searchParameters: {
         ...state.searchParameters,
         date,
         refresh: true
      }
   };
}
