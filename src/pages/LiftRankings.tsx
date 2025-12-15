import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { FitnessCenter, Videocam } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../app/store";
import { fetchAthleteLifts, setClassTypeFilter, setLiftTypeFilter, setPrTypeFilter } from "../slices/liftRankingsSlice";
import type { AthleteLiftRankingDto } from "../models/athlete-lift-ranking-dto";

function LiftRankings() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);
  const liftTypes = useSelector((state: RootState) => state.shared.liftTypes);
  const { athleteLiftRankings, loading, filters } = useSelector((state: RootState) => state.liftRankings);
  const initializedRef = useRef(false);

  // Initialize filters from URL params if they exist, otherwise use defaults
  useEffect(() => {
    if (!initializedRef.current && liftTypes.length > 0 && classTypes.length > 0) {
      // Read URL params
      const classTypeIdParam = searchParams.get("classTypeId");
      const liftTypeIdParam = searchParams.get("liftTypeId");
      const prTypeParam = searchParams.get("prType");

      // Set class type filter from URL param or default to 0 (All Classes)
      if (classTypeIdParam) {
        const classTypeId = Number(classTypeIdParam);
        if (!isNaN(classTypeId) && classTypeId > 0) {
          dispatch(setClassTypeFilter(classTypeId));
        } else {
          dispatch(setClassTypeFilter(null));
        }
      } else {
        dispatch(setClassTypeFilter(null));
      }

      // Set lift type filter from URL param or default to first option
      if (liftTypeIdParam) {
        const liftTypeId = Number(liftTypeIdParam);
        if (!isNaN(liftTypeId) && liftTypes.some((lt) => lt.id === liftTypeId)) {
          dispatch(setLiftTypeFilter(liftTypeId));
        } else {
          dispatch(setLiftTypeFilter(liftTypes[0].id));
        }
      } else {
        dispatch(setLiftTypeFilter(liftTypes[0].id));
      }

      // Set PR type filter from URL param or default to "current"
      if (prTypeParam && (prTypeParam === "current" || prTypeParam === "allTime" || prTypeParam === "all")) {
        dispatch(setPrTypeFilter(prTypeParam as "all" | "current" | "allTime"));
      } else {
        dispatch(setPrTypeFilter("current"));
      }

      initializedRef.current = true;
    }
  }, [dispatch, liftTypes, classTypes, searchParams]);

  // Update URL params when filters change
  useEffect(() => {
    if (initializedRef.current) {
      const newParams = new URLSearchParams();
      
      if (filters.classTypeId !== null && filters.classTypeId !== 0) {
        newParams.set("classTypeId", filters.classTypeId.toString());
      }
      
      if (filters.liftTypeId !== null) {
        newParams.set("liftTypeId", filters.liftTypeId.toString());
      }
      
      if (filters.prType && filters.prType !== "current") {
        newParams.set("prType", filters.prType);
      }
      
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.classTypeId, filters.liftTypeId, filters.prType]);

  useEffect(() => {
    // Only fetch data when lift type is set (required filter)
    if (filters.liftTypeId !== null && initializedRef.current) {
      dispatch(
        fetchAthleteLifts({
          classTypeId: filters.classTypeId === 0 || filters.classTypeId === null ? null : filters.classTypeId,
          liftTypeId: filters.liftTypeId,
          prType: filters.prType,
        })
      );
    }
  }, [dispatch, filters.classTypeId, filters.liftTypeId, filters.prType]);

  // Data is already filtered by the API
  const displayRankings = Array.isArray(athleteLiftRankings) ? athleteLiftRankings : [];

  const getClassTypeName = (classTypeId: number | null): string => {
    if (!classTypeId) return "N/A";
    const classType = classTypes.find((ct) => ct.id === classTypeId);
    return classType?.name || `Class ${classTypeId}`;
  };

  const getUserName = (ranking: AthleteLiftRankingDto): string => {
    if (ranking.lastName && ranking.firstName) {
      return `${ranking.lastName}, ${ranking.firstName}`;
    }
    return ranking.firstName || ranking.lastName || "Unknown";
  };

  // Prepare data for DataGrid with unique IDs
  const rows = displayRankings.map((ranking, index) => ({
    id: `${ranking.firstName}-${ranking.lastName}-${ranking.liftType.id}-${index}`,
    athleteName: getUserName(ranking),
    currentClass: getClassTypeName(ranking.currentClassTypeId),
    liftType: ranking.liftType.name,
    weight: ranking.weight,
    prType: ranking.isPr ? "All Time PR" : "Current PR",
    videoUrl: ranking.videoUrl,
  }));

  const columns: GridColDef[] = [
    { field: "athleteName", headerName: "Athlete Name", flex: 1, minWidth: 150 },
    { field: "currentClass", headerName: "Current Class", flex: 1, minWidth: 150 },
    { field: "liftType", headerName: "Lift Type", flex: 1, minWidth: 150 },
    { field: "weight", headerName: "Weight (lbs)", flex: 1, minWidth: 120 },
    { field: "prType", headerName: "PR Type", flex: 1, minWidth: 120 },
    {
      field: "videoUrl",
      headerName: "Video",
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => {
        if (params.value) {
          return (
            <IconButton component="a" href={params.value} target="_blank" rel="noopener noreferrer" aria-label="Watch video" size="small">
              <Videocam className="primary-blue" />
            </IconButton>
          );
        }
        return (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, flexShrink: 0 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FitnessCenter className="primary-blue" />
          Highland Athlete Lift Rankings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          View and compare lift rankings across all athletes
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Athlete's Current Class</InputLabel>
              <Select
                value={filters.classTypeId ?? 0}
                label="Athlete's Current Class"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  dispatch(setClassTypeFilter(value));
                }}
              >
                <MenuItem value={0}>All Classes</MenuItem>
                {classTypes.map((classType) => {
                  return (
                    <MenuItem key={classType.id} value={classType.id}>
                      {classType.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Lift Type</InputLabel>
              <Select
                value={filters.liftTypeId || (liftTypes.length > 0 ? liftTypes[0].id : "")}
                label="Lift Type"
                onChange={(e) => dispatch(setLiftTypeFilter(e.target.value ? Number(e.target.value) : null))}
              >
                {liftTypes.map((liftType) => {
                  const liftTypeId = liftType.id;
                  return (
                    <MenuItem key={liftTypeId} value={liftTypeId}>
                      {liftType.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>PR Type</InputLabel>
              <Select value={filters.prType} label="PR Type" onChange={(e) => dispatch(setPrTypeFilter(e.target.value as "all" | "current" | "allTime"))}>
                <MenuItem value="current">Current PRs</MenuItem>
                <MenuItem value="allTime">All Time PRs</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Box>

      {/* Rankings DataGrid */}
      <Box sx={{ flex: 1, overflow: "hidden", px: 3, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 0,
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "background.paper",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
              }}
              slots={{
                noRowsOverlay: () => (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Typography variant="body2" color="text.secondary">
                      No lifts found. Try adjusting your filters.
                    </Typography>
                  </Box>
                ),
              }}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default LiftRankings;
