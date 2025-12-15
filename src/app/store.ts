import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authenticationReducer, { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, updateUser } from "../slices/authenticationSlice";
import sharedReducer from "../slices/sharedSlice";
import liftRankingsReducer from "../slices/liftRankingsSlice";

// Create the listener middleware
const listenerMiddleware = createListenerMiddleware();

// Listen for registration success
listenerMiddleware.startListening({
  actionCreator: registerUser.fulfilled,
  effect: () => {
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
  effect: () => {
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

// Listen for logout success
listenerMiddleware.startListening({
  actionCreator: logoutUser.fulfilled,
  effect: () => {
    toast.success("You have been logged out successfully.");
  },
});

// Listen for logout errors
listenerMiddleware.startListening({
  actionCreator: logoutUser.rejected,
  effect: (action) => {
    // Even if logout API fails, user is still logged out locally
    const errorMessage = action.payload as string || "Logout completed (session may still be active on server).";
    toast.warning(errorMessage);
  },
});

// Listen for forgot password success
listenerMiddleware.startListening({
  actionCreator: forgotPassword.fulfilled,
  effect: () => {
    toast.success("Password reset email sent! Please check your inbox.");
  },
});

// Listen for forgot password errors
listenerMiddleware.startListening({
  actionCreator: forgotPassword.rejected,
  effect: (action) => {
    const errorMessage = action.payload as string || "Failed to send password reset email. Please try again.";
    toast.error(errorMessage);
  },
});

// Listen for reset password success
listenerMiddleware.startListening({
  actionCreator: resetPassword.fulfilled,
  effect: () => {
    toast.success("Password reset successful! You can now log in with your new password.");
  },
});

// Listen for reset password errors
listenerMiddleware.startListening({
  actionCreator: resetPassword.rejected,
  effect: (action) => {
    const errorMessage = action.payload as string || "Failed to reset password. Please try again.";
    toast.error(errorMessage);
  },
});

// Listen for update user success
listenerMiddleware.startListening({
  actionCreator: updateUser.fulfilled,
  effect: () => {
    toast.success("Profile updated successfully!");
  },
});

// Listen for update user errors
listenerMiddleware.startListening({
  actionCreator: updateUser.rejected,
  effect: (action) => {
    const errorMessage = action.payload as string || "Failed to update profile. Please try again.";
    toast.error(errorMessage);
  },
});

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    shared: sharedReducer,
    liftRankings: liftRankingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

