import { combineReducers } from '@reduxjs/toolkit';
import chatReducer from './chatReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  chat: chatReducer,
  session: sessionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
