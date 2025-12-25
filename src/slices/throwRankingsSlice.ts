import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AthleteThrowRankingDto } from "../models/athlete-throw-ranking-dto";
import type { AthleteThrowOverallRankingDto } from "../models/athlete-throw-overall-ranking-dto";

interface ThrowRankingsState {
  athleteThrowRankings: AthleteThrowRankingDto[];
  athleteThrowOverallRankings: AthleteThrowOverallRankingDto[];
  loading: boolean;
  error: string | null;
  filters: {
    classTypeId: number | null;
    throwTypeId: number | null;
  };
}

const initialState: ThrowRankingsState = {
  athleteThrowRankings: [],
  athleteThrowOverallRankings: [],
  loading: false,
  error: null,
  filters: {
    classTypeId: null,
    throwTypeId: null,
  },
};

// API base URL - defaults to localhost:3333 (typical AdonisJS port)
// Can be overridden with VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

// Fetch athlete throws async thunk
export const fetchAthleteThrows = createAsyncThunk(
  "throwRankings/fetchAthleteThrows",
  async (filters: { classTypeId?: number | null; throwTypeId?: number | null }, { rejectWithValue }) => {
    try {
      // If throwTypeId is null (Overall), use the overall endpoint
      if (filters.throwTypeId === null || filters.throwTypeId === undefined) {
        const params = new URLSearchParams();
        if (filters.classTypeId) {
          params.append("classTypeId", filters.classTypeId.toString());
        }

        const response = await fetch(`${API_BASE_URL}/api/athlete-throws/rankings/overall?${params.toString()}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(data.message || "Failed to fetch athlete throw overall rankings");
        }

        // Return object with type indicator and data
        const athleteThrowOverallRankings = data.athleteThrowOverallRankings || data.athleteThrows || data || [];
        return {
          type: "overall" as const,
          data: Array.isArray(athleteThrowOverallRankings) ? athleteThrowOverallRankings : [],
        };
      } else {
        // Use the regular rankings endpoint
        const params = new URLSearchParams();
        if (filters.classTypeId) {
          params.append("classTypeId", filters.classTypeId.toString());
        }
        if (filters.throwTypeId) {
          params.append("throwTypeId", filters.throwTypeId.toString());
        }

        const response = await fetch(`${API_BASE_URL}/api/athlete-throws/rankings?${params.toString()}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(data.message || "Failed to fetch athlete throws");
        }

        // Return object with type indicator and data
        const athleteThrowRankings = data.athleteThrowRankings || data.athleteThrows || data || [];
        return {
          type: "specific" as const,
          data: Array.isArray(athleteThrowRankings) ? athleteThrowRankings : [],
        };
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch athlete throws");
    }
  }
);

export const throwRankingsSlice = createSlice({
  name: "throwRankings",
  initialState,
  reducers: {
    setClassTypeFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.classTypeId = action.payload;
    },
    setThrowTypeFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.throwTypeId = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        classTypeId: null,
        throwTypeId: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch user throws
    builder
      .addCase(fetchAthleteThrows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAthleteThrows.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.type === "overall") {
          state.athleteThrowOverallRankings = action.payload.data as AthleteThrowOverallRankingDto[];
          state.athleteThrowRankings = [];
        } else {
          state.athleteThrowRankings = action.payload.data as AthleteThrowRankingDto[];
          state.athleteThrowOverallRankings = [];
        }
        state.error = null;
      })
      .addCase(fetchAthleteThrows.rejected, (state, action) => {
        state.loading = false;
        state.athleteThrowRankings = [];
        state.error = action.payload as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setClassTypeFilter, setThrowTypeFilter, clearFilters } = throwRankingsSlice.actions;

export default throwRankingsSlice.reducer;

