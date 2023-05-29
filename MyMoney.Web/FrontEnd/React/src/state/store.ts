import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session-slice';
import { IAppState } from './types';
import transactionsReducer  from './transactions-slice';

export const store = configureStore<IAppState>({
    reducer: {
        session: sessionReducer,
        transactions: transactionsReducer
    }
});