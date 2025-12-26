import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../models/user";

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  hasMorePages: boolean;
}

interface AthletesState {
  athletes: User[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  selectedAthlete: User | null;
  selectedAthleteLoading: boolean;
  selectedAthleteError: string | null;
  recentUsers: User[];
  recentUsersLoading: boolean;
  recentUsersError: string | null;
}

const initialState: AthletesState = {
  athletes: [],
  pagination: null,
  loading: false,
  error: null,
  selectedAthlete: null,
  selectedAthleteLoading: false,
  selectedAthleteError: null,
  recentUsers: [],
  recentUsersLoading: false,
  recentUsersError: null,
};

// API base URL - defaults to localhost:3333 (typical AdonisJS port)
// Can be overridden with VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

// Fetch all users async thunk with pagination and filtering support
export const getAllUsers = createAsyncThunk(
  "athletes/getAllUsers",
  async (
    params: { page?: number; perPage?: number; search?: string; classTypeId?: number | null; state?: string | null } = {},
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, perPage = 50, search, classTypeId, state } = params;
      const url = new URL(`${API_BASE_URL}/api/users`);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("perPage", perPage.toString());
      
      if (search && search.trim() !== "") {
        url.searchParams.set("name", search.trim());
      }
      
      if (classTypeId !== null && classTypeId !== undefined) {
        url.searchParams.set("classTypeId", classTypeId.toString());
      }

      if (state !== null && state !== undefined && state !== "") {
        url.searchParams.set("state", state);
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch athletes");
      }

      // Handle paginated response structure
      if (data.users && data.meta) {
        return {
          users: Array.isArray(data.users) ? data.users : [],
          meta: data.meta,
        };
      }

      // Fallback for non-paginated responses
      return {
        users: Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : [],
        meta: null,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch athletes"
      );
    }
  }
);

// Fetch user by ID async thunk
export const getUserById = createAsyncThunk(
  "athletes/getUserById",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch athlete");
      }

      // Handle different possible response formats
      return data.user || data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch athlete"
      );
    }
  }
);

// Fetch recent users async thunk
export const getRecentUsers = createAsyncThunk(
  "athletes/getRecentUsers",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/users/recent`);
      if (limit !== undefined && limit > 0) {
        url.searchParams.set("limit", limit.toString());
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch recent users");
      }

      // Handle different possible response formats
      if (data.users && Array.isArray(data.users)) {
        return data.users;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch recent users"
      );
    }
  }
);

export const athletesSlice = createSlice({
  name: "athletes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAthletes: (state) => {
      state.athletes = [];
      state.pagination = null;
      state.error = null;
    },
    clearSelectedAthlete: (state) => {
      state.selectedAthlete = null;
      state.selectedAthleteError = null;
    },
    clearRecentUsers: (state) => {
      state.recentUsers = [];
      state.recentUsersError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (
          state,
          action: PayloadAction<{ users: User[]; meta: PaginationMeta | null }>
        ) => {
          state.loading = false;
          state.athletes = action.payload.users;
          state.pagination = action.payload.meta;
          state.error = null;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.athletes = [];
        state.pagination = null;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(getUserById.pending, (state) => {
        state.selectedAthleteLoading = true;
        state.selectedAthleteError = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.selectedAthleteLoading = false;
        state.selectedAthlete = action.payload;
        state.selectedAthleteError = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.selectedAthleteLoading = false;
        state.selectedAthlete = null;
        state.selectedAthleteError = action.payload as string;
      });

    // Fetch recent users
    builder
      .addCase(getRecentUsers.pending, (state) => {
        state.recentUsersLoading = true;
        state.recentUsersError = null;
      })
      .addCase(getRecentUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.recentUsersLoading = false;
        state.recentUsers = action.payload;
        state.recentUsersError = null;
      })
      .addCase(getRecentUsers.rejected, (state, action) => {
        state.recentUsersLoading = false;
        state.recentUsers = [];
        state.recentUsersError = action.payload as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearError, clearAthletes, clearSelectedAthlete, clearRecentUsers } = athletesSlice.actions;

export default athletesSlice.reducer;

