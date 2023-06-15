import { ActionReducerMap } from '@ngrx/store';
import {
   ISessionState,
   sessionReducer,
   ITransactionState,
   transactionReducer,
   IBudgetState,
   budgetReducer,
   incomeReducer,
   IIncomeState,
} from './reducers/';

export interface IAppState {
   session: ISessionState;
   transactions: ITransactionState;
   budgets: IBudgetState;
   incomes: IIncomeState;
}

export const appReducer: ActionReducerMap<IAppState | any> = {
   session: sessionReducer,
   transactions: transactionReducer,
   budgets: budgetReducer,
   incomes: incomeReducer,
};
