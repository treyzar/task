import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import usersReducer from './slices/usersSlice';
import labelsReducer from './slices/labelsSlice';
import modalReducer from './slices/modalSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    users: usersReducer,
    labels: labelsReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 