import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress, Paper, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { People, Search } from "@mui/icons-material";
import { getAllUsers } from "../slices/athletesSlice";
import type { AppDispatch, RootState } from "../app/store";
import AthleteProfile from "../components/athlete-profiles/AthleteProfileCard";

function AthleteProfiles() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { athletes, pagination, loading } = useSelector((state: RootState) => state.athletes);
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);
  const states = useSelector((state: RootState) => state.shared.states);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassTypeId, setSelectedClassTypeId] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);
  const hasInitialFetchRef = useRef(false);
  const prevFiltersRef = useRef<{ search: string; classTypeId: number | null; state: string | null } | null>(null);

  // Initialize filters from URL params if they exist
  useEffect(() => {
    if (!initializedRef.current && classTypes.length > 0 && states.length > 0) {
      // Read URL params
      const classTypeIdParam = searchParams.get("classTypeId");
      const searchParam = searchParams.get("search");
      const stateParam = searchParams.get("state");

      // Set class type filter from URL param
      if (classTypeIdParam) {
        const classTypeId = Number(classTypeIdParam);
        if (!isNaN(classTypeId) && classTypeId > 0 && classTypes.some((ct) => ct.id === classTypeId)) {
          setSelectedClassTypeId(classTypeId);
        } else {
          setSelectedClassTypeId(null);
        }
      } else {
        setSelectedClassTypeId(null);
      }

      // Set state filter from URL param
      if (stateParam) {
        if (states.some((s) => s.abbreviation === stateParam)) {
          setSelectedState(stateParam);
        } else {
          setSelectedState(null);
        }
      } else {
        setSelectedState(null);
      }

      // Set search term from URL param
      if (searchParam) {
        setSearchTerm(searchParam);
      } else {
        setSearchTerm("");
      }

      initializedRef.current = true;
    }
  }, [classTypes, states, searchParams]);

  // Initial fetch on component mount (after initialization)
  useEffect(() => {
    if (initializedRef.current && !hasInitialFetchRef.current && classTypes.length > 0 && states.length > 0) {
      // Read URL params directly to get the actual filter values
      const classTypeIdParam = searchParams.get("classTypeId");
      const searchParam = searchParams.get("search");
      const stateParam = searchParams.get("state");

      const initialClassTypeId = classTypeIdParam
        ? (() => {
            const id = Number(classTypeIdParam);
            return !isNaN(id) && id > 0 && classTypes.some((ct) => ct.id === id) ? id : null;
          })()
        : null;

      const initialState = stateParam && states.some((s) => s.abbreviation === stateParam) ? stateParam : null;
      const initialSearch = searchParam || "";

      hasInitialFetchRef.current = true;
      prevFiltersRef.current = { search: initialSearch, classTypeId: initialClassTypeId, state: initialState };
      dispatch(getAllUsers({ page: 1, perPage: 50, search: initialSearch, classTypeId: initialClassTypeId, state: initialState }));
    }
  }, [dispatch, classTypes.length, states.length, searchParams]);

  // Update URL params when filters change
  useEffect(() => {
    if (initializedRef.current) {
      const newParams = new URLSearchParams();

      if (selectedClassTypeId !== null) {
        newParams.set("classTypeId", selectedClassTypeId.toString());
      }

      if (selectedState !== null && selectedState !== "") {
        newParams.set("state", selectedState);
      }

      if (searchTerm && searchTerm.trim() !== "") {
        newParams.set("search", searchTerm.trim());
      }

      setSearchParams(newParams, { replace: true });
    }
  }, [selectedClassTypeId, selectedState, searchTerm, setSearchParams]);

  // Handle filter changes with debouncing (only after initial fetch)
  useEffect(() => {
    // Skip if we haven't done initial fetch yet
    if (!hasInitialFetchRef.current) {
      return;
    }

    // Check if filters have actually changed
    const prevFilters = prevFiltersRef.current;
    if (
      prevFilters &&
      prevFilters.search === searchTerm &&
      prevFilters.classTypeId === selectedClassTypeId &&
      prevFilters.state === selectedState
    ) {
      return;
    }

    // Update previous filters
    prevFiltersRef.current = { search: searchTerm, classTypeId: selectedClassTypeId, state: selectedState };

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(getAllUsers({ page: 1, perPage: 50, search: searchTerm, classTypeId: selectedClassTypeId, state: selectedState }));
    }, 500); // 500ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [dispatch, searchTerm, selectedClassTypeId, selectedState]);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, flexShrink: 0 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1 }}>
          <People className="primary-blue" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Athlete Profiles
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Browse and discover athletes in the Highland Athlete community
          {pagination && (
            <Typography component="span" variant="body2" sx={{ ml: 1 }}>
              ({pagination.total} total)
            </Typography>
          )}
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter athlete name..."
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
            <FormControl sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { xs: "100%", sm: 300 } }}>
              <InputLabel>Class Type</InputLabel>
              <Select
                value={selectedClassTypeId === null ? "all" : String(selectedClassTypeId)}
                label="Class Type"
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedClassTypeId(value === "all" ? null : Number(value));
                }}
                renderValue={(value) => {
                  if (value === "all" || value === "") {
                    return "All Classes";
                  }
                  const classType = classTypes.find((ct) => ct.id === Number(value));
                  return classType?.name || "All Classes";
                }}
              >
                <MenuItem value="all">All Classes</MenuItem>
                {classTypes.map((classType) => (
                  <MenuItem key={classType.id} value={classType.id}>
                    {classType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { xs: "100%", sm: 200 } }}>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState === null ? "all" : selectedState}
                label="State"
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedState(value === "all" ? null : value);
                }}
                renderValue={(value) => {
                  if (value === "all" || value === "") {
                    return "All States";
                  }
                  const state = states.find((s) => s.abbreviation === value);
                  return state ? `${state.abbreviation} - ${state.name}` : "All States";
                }}
              >
                <MenuItem value="all">All States</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.abbreviation} value={state.abbreviation}>
                    {state.abbreviation} - {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {pagination && (searchTerm || selectedClassTypeId !== null || selectedState !== null) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Showing {athletes.length} of {pagination.total} athletes
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Athletes Grid */}
      <Box sx={{ flex: 1, overflow: "auto", px: 3, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
            <CircularProgress />
          </Box>
        ) : athletes.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No athletes found. {searchTerm || selectedClassTypeId !== null || selectedState !== null ? "Try adjusting your filters." : ""}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {athletes.map((athlete) => (
              <Grid key={athlete.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
                <AthleteProfile user={athlete} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default AthleteProfiles;
