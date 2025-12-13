import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authenticationReducer, { registerUser, loginUser } from "../slices/authenticationSlice";

// Create the listener middleware
const listenerMiddleware = createListenerMiddleware();

// Listen for registration success
listenerMiddleware.startListening({
  actionCreator: registerUser.fulfilled,
  effect: (action) => {
    toast.success("Registration successful! Welcome!");
  },
});

// Listen for registration errors
listenerMiddleware.startListening({
  actionCreator: registerUser.rejected,
  effect: (action) => {
    const errorMessage = action.payload as string || "Registration failed. Please try again.";
    toast.error(errorMessage);
  },
});

// Listen for login success
listenerMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  effect: (action) => {
    toast.success("Login successful! Welcome back!");
  },
});

// Listen for login errors
listenerMiddleware.startListening({
  actionCreator: loginUser.rejected,
  effect: (action) => {
    const errorMessage = action.payload as string || "Login failed. Please check your credentials.";
    toast.error(errorMessage);
  },
});

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

