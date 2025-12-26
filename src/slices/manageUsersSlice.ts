import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../models/user";

interface ManageUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: ManageUsersState = {
  users: [],
  loading: false,
  error: null,
};

// API base URL - defaults to localhost:3333 (typical AdonisJS port)
// Can be overridden with VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

// Fetch all users for management async thunk
export const fetchAllUsers = createAsyncThunk(
  "manageUsers/fetchAllUsers",
  async (search: string | undefined = undefined, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/users/all`);
      if (search && search.trim() !== "") {
        url.searchParams.set("search", search.trim());
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch users");
      }

      // API returns an array of users directly
      return Array.isArray(data) ? data : Array.isArray(data.users) ? data.users : [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    }
  }
);

// Update user async thunk
export const updateUser = createAsyncThunk(
  "manageUsers/updateUser",
  async (
    { userId, userData }: { userId: number; userData: { roleId?: number | null; accountLockedUntil?: string | null } },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update user");
      }

      return data.user || data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update user"
      );
    }
  }
);

export const manageUsersSlice = createSlice({
  name: "manageUsers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.users = [];
        state.error = action.payload as string;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        // Update the user in the users array
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearError, clearUsers } = manageUsersSlice.actions;

export default manageUsersSlice.reducer;

