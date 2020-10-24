import { ActionReducerMap } from '@ngrx/store';
import { ISessionState, sessionReducer, ITransactionState, transactionReducer, IBudgetState, budgetReducer } from './reducers/';

export interface IAppState {
   session: ISessionState;
   transactions: ITransactionState;
   budgets: IBudgetState;
}

export const appReducer: ActionReducerMap<IAppState | any> = {
   session: sessionReducer,
   transactions: transactionReducer,
   budgets: budgetReducer,
};
