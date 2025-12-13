import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../slices/authenticationSlice";

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

