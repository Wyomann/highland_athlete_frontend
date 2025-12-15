import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AthleteLiftRankingDto } from "../models/athlete-lift-ranking-dto";

interface LiftRankingsState {
  athleteLiftRankings: AthleteLiftRankingDto[];
  loading: boolean;
  error: string | null;
  filters: {
    classTypeId: number | null;
    liftTypeId: number | null;
    prType: "all" | "current" | "allTime";
  };
}

const initialState: LiftRankingsState = {
  athleteLiftRankings: [],
  loading: false,
  error: null,
  filters: {
    classTypeId: null,
    liftTypeId: null,
    prType: "current",
  },
};

// API base URL - defaults to localhost:3333 (typical AdonisJS port)
// Can be overridden with VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

// Fetch athlete lifts async thunk
export const fetchAthleteLifts = createAsyncThunk(
  "liftRankings/fetchAthleteLifts",
  async (filters: { classTypeId?: number | null; liftTypeId?: number | null; prType?: "all" | "current" | "allTime" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.classTypeId) {
        params.append("classTypeId", filters.classTypeId.toString());
      }
      if (filters.liftTypeId) {
        params.append("liftTypeId", filters.liftTypeId.toString());
      }
      if (filters.prType === "current") {
        params.append("is_current_pr", "true");
      } else if (filters.prType === "allTime") {
        params.append("is_pr", "true");
      }
      // If prType is "all", don't send the parameter

      const response = await fetch(`${API_BASE_URL}/api/athlete-lifts/rankings?${params.toString()}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch athlete lifts");
      }

      // Ensure we always return an array
      const athleteLiftRankings = data.athleteLiftRankings || data.athleteLifts || data || [];
      return Array.isArray(athleteLiftRankings) ? athleteLiftRankings : [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch athlete lifts");
    }
  }
);

export const liftRankingsSlice = createSlice({
  name: "liftRankings",
  initialState,
  reducers: {
    setClassTypeFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.classTypeId = action.payload;
    },
    setLiftTypeFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.liftTypeId = action.payload;
    },
    setPrTypeFilter: (state, action: PayloadAction<"all" | "current" | "allTime">) => {
      state.filters.prType = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        classTypeId: null,
        liftTypeId: null,
        prType: "current",
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch user lifts
    builder
      .addCase(fetchAthleteLifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAthleteLifts.fulfilled, (state, action: PayloadAction<AthleteLiftRankingDto[]>) => {
        state.loading = false;
        state.athleteLiftRankings = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchAthleteLifts.rejected, (state, action) => {
        state.loading = false;
        state.athleteLiftRankings = [];
        state.error = action.payload as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setClassTypeFilter, setLiftTypeFilter, setPrTypeFilter, clearFilters } = liftRankingsSlice.actions;

export default liftRankingsSlice.reducer;
