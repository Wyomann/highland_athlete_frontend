import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridPaginationModel } from "@mui/x-data-grid";
import { SportsBaseball, Videocam } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../app/store";
import { fetchAthleteThrows, setClassTypeFilter, setThrowTypeFilter } from "../slices/throwRankingsSlice";
import type { AthleteThrowRankingDto } from "../models/athlete-throw-ranking-dto";

function ThrowRankings() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);
  const throwTypes = useSelector((state: RootState) => state.shared.throwTypes);
  const { athleteThrowRankings, loading, filters } = useSelector((state: RootState) => state.throwRankings);
  const initializedRef = useRef(false);
  const hasInitialFetchRef = useRef(false);
  const prevFiltersRef = useRef<{ classTypeId: number | null; throwTypeId: number | null } | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  // Initialize filters from URL params if they exist, otherwise use defaults
  useEffect(() => {
    if (!initializedRef.current && throwTypes.length > 0 && classTypes.length > 0) {
      // Read URL params
      const classTypeIdParam = searchParams.get("classTypeId");
      const throwTypeIdParam = searchParams.get("throwTypeId");

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

      // Set throw type filter from URL param or default to first option
      if (throwTypeIdParam) {
        const throwTypeId = Number(throwTypeIdParam);
        if (!isNaN(throwTypeId) && throwTypes.some((tt) => tt.id === throwTypeId)) {
          dispatch(setThrowTypeFilter(throwTypeId));
        } else {
          dispatch(setThrowTypeFilter(throwTypes[0].id));
        }
      } else {
        dispatch(setThrowTypeFilter(throwTypes[0].id));
      }

      initializedRef.current = true;
    }
  }, [dispatch, throwTypes, classTypes, searchParams]);

  // Initial fetch after filters are initialized (only once)
  useEffect(() => {
    if (initializedRef.current && !hasInitialFetchRef.current && filters.throwTypeId !== null) {
      // Use a small timeout to ensure all filter dispatches have completed
      const timeoutId = setTimeout(() => {
        if (!hasInitialFetchRef.current) {
          hasInitialFetchRef.current = true;
          const currentFilters = {
            classTypeId: filters.classTypeId === 0 || filters.classTypeId === null ? null : filters.classTypeId,
            throwTypeId: filters.throwTypeId,
          };
          prevFiltersRef.current = currentFilters;
          dispatch(fetchAthleteThrows(currentFilters));
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, filters.classTypeId, filters.throwTypeId]);

  // Update URL params when filters change
  useEffect(() => {
    if (initializedRef.current) {
      const newParams = new URLSearchParams();

      if (filters.classTypeId !== null && filters.classTypeId !== 0) {
        newParams.set("classTypeId", filters.classTypeId.toString());
      }

      if (filters.throwTypeId !== null) {
        newParams.set("throwTypeId", filters.throwTypeId.toString());
      }

      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.classTypeId, filters.throwTypeId]);

  // Fetch data when filters change (after initial fetch)
  useEffect(() => {
    // Only fetch if we've done the initial fetch and filters have actually changed
    if (hasInitialFetchRef.current && filters.throwTypeId !== null) {
      const currentFilters = {
        classTypeId: filters.classTypeId === 0 || filters.classTypeId === null ? null : filters.classTypeId,
        throwTypeId: filters.throwTypeId,
      };

      const prevFilters = prevFiltersRef.current;
      if (
        prevFilters &&
        (prevFilters.classTypeId !== currentFilters.classTypeId ||
          prevFilters.throwTypeId !== currentFilters.throwTypeId)
      ) {
        prevFiltersRef.current = currentFilters;
        dispatch(fetchAthleteThrows(currentFilters));
      }
    }
  }, [dispatch, filters.classTypeId, filters.throwTypeId]);

  // Filter by throw's class (classType.id) if a class filter is selected
  const displayRankings = Array.isArray(athleteThrowRankings)
    ? athleteThrowRankings.filter((ranking) => {
        // If no class filter is selected (null or 0), show all throws
        if (!filters.classTypeId || filters.classTypeId === 0) {
          return true;
        }
        // Filter by the throw's class (classType.id), not the athlete's current class
        return ranking.classType?.id === filters.classTypeId;
      })
    : [];

  const getClassTypeName = (classTypeId: number | null): string => {
    if (!classTypeId) return "N/A";
    const classType = classTypes.find((ct) => ct.id === classTypeId);
    return classType?.name || `Class ${classTypeId}`;
  };

  const getUserName = (ranking: AthleteThrowRankingDto): string => {
    if (ranking.lastName && ranking.firstName) {
      return `${ranking.firstName} ${ranking.lastName}`;
    }
    return ranking.firstName || ranking.lastName || "Unknown";
  };

  // Helper function to convert decimal distance (in feet) to feet and inches
  const convertFromDistance = (distance: number): { feet: number; inches: number } => {
    const feet = Math.floor(distance);
    const inches = Math.round((distance - feet) * 12);
    return { feet, inches };
  };

  // Prepare data for DataGrid with unique IDs
  const rows = displayRankings.map((ranking, index) => {
    const { feet, inches } = convertFromDistance(ranking.distance);
    return {
      id: `${ranking.firstName}-${ranking.lastName}-${ranking.throwType.id}-${index}`,
      rank: index + 1,
      athleteName: getUserName(ranking),
      userId: ranking.userId || null,
      throwClass: ranking.classType?.name || "N/A",
      throwType: ranking.throwType.name,
      distance: ranking.distance,
      distanceDisplay: `${feet}' ${inches}"`,
      videoUrl: ranking.videoUrl,
    };
  });

  const columns: GridColDef[] = [
    { field: "rank", headerName: "Rank", type: "number", width: 80, align: "center", headerAlign: "center" },
    {
      field: "athleteName",
      headerName: "Athlete Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        const userId = params.row.userId;
        if (userId) {
          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Link
                to={`/athletes/${userId}`}
                style={{
                  textDecoration: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Typography
                  variant="body2"
                  className="primary-blue"
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {params.value}
                </Typography>
              </Link>
            </Box>
          );
        }
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        );
      },
    },
    { field: "distanceDisplay", headerName: "Distance", flex: 1, minWidth: 120 },
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
    { field: "throwClass", headerName: "Class", flex: 1, minWidth: 150 },
    { field: "throwType", headerName: "Throw Type", flex: 1, minWidth: 150 },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, flexShrink: 0 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SportsBaseball className="primary-blue" />
          Highland Athlete Throw Rankings by Personal Record
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          View and compare throw rankings across all athletes
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { xs: "100%", sm: 300 } }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={filters.classTypeId ?? 0}
                label="Class"
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

            <FormControl sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { xs: "100%", sm: 200 } }}>
              <InputLabel>Throw Type</InputLabel>
              <Select
                value={filters.throwTypeId || (throwTypes.length > 0 ? throwTypes[0].id : "")}
                label="Throw Type"
                onChange={(e) => dispatch(setThrowTypeFilter(e.target.value ? Number(e.target.value) : null))}
              >
                {throwTypes.map((throwType) => {
                  const throwTypeId = throwType.id;
                  return (
                    <MenuItem key={throwTypeId} value={throwTypeId}>
                      {throwType.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Box>

      {/* Rankings DataGrid */}
      <Box
        sx={{
          flex: { xs: "0 1 auto", sm: 1 },
          overflow: { xs: "visible", sm: "visible" },
          px: 3,
          pb: 3,
          "& *::-webkit-scrollbar": {
            display: "none",
          },
          "& *": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[25, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pagination
              disableRowSelectionOnClick
              sx={{
                height: "auto",
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
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                  display: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "& .MuiDataGrid-main::-webkit-scrollbar": {
                  display: "none",
                },
                "& .MuiDataGrid-main": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "& .MuiDataGrid-root::-webkit-scrollbar": {
                  display: "none",
                },
                "& .MuiDataGrid-root": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              slots={{
                noRowsOverlay: () => (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Typography variant="body2" color="text.secondary">
                      No throws found. Try adjusting your filters.
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

export default ThrowRankings;

