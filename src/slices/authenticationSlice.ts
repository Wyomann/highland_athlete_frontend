import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../models/user";


interface AuthenticationState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthenticationState = {
  user: null,
  loading: false,
  error: null,
};

// API base URL - defaults to localhost:3333 (typical AdonisJS port)
// Can be overridden with VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Register user async thunk
export const registerUser = createAsyncThunk(
  'authentication/register',
  async (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    recaptchaToken?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session-based auth
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  }
);

// Login user async thunk
export const loginUser = createAsyncThunk(
  'authentication/login',
  async (credentials: {
    email: string;
    password: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session-based auth
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  }
);

// Fetch current user async thunk
export const fetchUser = createAsyncThunk(
  'authentication/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: 'include', // Include cookies for session-based auth
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch user');
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user'
      );
    }
  }
);

// Logout user async thunk
export const logoutUser = createAsyncThunk(
  'authentication/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies for session-based auth
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.message || 'Logout failed');
      }

      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Logout failed'
      );
    }
  }
);

// Forgot password async thunk
export const forgotPassword = createAsyncThunk(
  'authentication/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return rejectWithValue(responseData.message || 'Failed to send password reset email');
      }

      return responseData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to send password reset email'
      );
    }
  }
);

// Reset password async thunk
export const resetPassword = createAsyncThunk(
  'authentication/resetPassword',
  async (data: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return rejectWithValue(responseData.message || 'Failed to reset password');
      }

      return responseData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to reset password'
      );
    }
  }
);

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        // Clear user if session is invalid/expired
        state.user = null;
        state.error = action.payload as string;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Even if logout API fails, clear user state
        state.user = null;
        state.error = action.payload as string;
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { logout, clearError } = authenticationSlice.actions;

export default authenticationSlice.reducer;

