import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session-slice';
import { IAppState } from './types';

export const store = configureStore<IAppState>({
    reducer: {
        session: sessionReducer
    }
});