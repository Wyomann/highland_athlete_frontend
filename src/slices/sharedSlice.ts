import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ThrowType } from "../models/throw-type";
import type { LiftType } from "../models/lift-type";
import type { ClassType } from "../models/class-type";
import type { State } from "../models/state";

interface SharedState {
  throwTypes: ThrowType[];
  liftTypes: LiftType[];
  classTypes: ClassType[];
  states: State[];
  loading: boolean;
  error: string | null;
}

const initialState: SharedState = {
  throwTypes: [],
  liftTypes: [],
  classTypes: [],
  states: [],
  loading: false,
  error: null,
};

// API base URL - defaults to localhost:3333 (typical AdonisJS port)
// Can be overridden with VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Fetch throw types async thunk
export const fetchThrowTypes = createAsyncThunk(
  'shared/fetchThrowTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/throw-types`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch throw types');
      }

      return data.throwTypes || data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch throw types'
      );
    }
  }
);

// Fetch lift types async thunk
export const fetchLiftTypes = createAsyncThunk(
  'shared/fetchLiftTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lift-types`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch lift types');
      }

      return data.liftTypes || data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch lift types'
      );
    }
  }
);

// Fetch class types async thunk
export const fetchClassTypes = createAsyncThunk(
  'shared/fetchClassTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/class-types`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch class types');
      }

      return data.classTypes || data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch class types'
      );
    }
  }
);

// Fetch states async thunk
export const fetchStates = createAsyncThunk(
  'shared/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/states`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch states');
      }

      return data.states || data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch states'
      );
    }
  }
);

export const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch throw types
    builder
      .addCase(fetchThrowTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThrowTypes.fulfilled, (state, action: PayloadAction<ThrowType[]>) => {
        state.loading = false;
        state.throwTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchThrowTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lift types
    builder
      .addCase(fetchLiftTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiftTypes.fulfilled, (state, action: PayloadAction<LiftType[]>) => {
        state.loading = false;
        state.liftTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchLiftTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch class types
    builder
      .addCase(fetchClassTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassTypes.fulfilled, (state, action: PayloadAction<ClassType[]>) => {
        state.loading = false;
        state.classTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchClassTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch states
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action: PayloadAction<State[]>) => {
        state.loading = false;
        state.states = action.payload;
        state.error = null;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearError } = sharedSlice.actions;

export default sharedSlice.reducer;

