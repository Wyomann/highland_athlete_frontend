import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridPaginationModel } from "@mui/x-data-grid";
import { SportsBaseball, Videocam } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../app/store";
import { fetchAthleteThrows, setClassTypeFilter, setThrowTypeFilter } from "../slices/throwRankingsSlice";
import type { AthleteThrowRankingDto } from "../models/athlete-throw-ranking-dto";
import type { AthleteThrowOverallRankingDto } from "../models/athlete-throw-overall-ranking-dto";

function ThrowRankings() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);
  const throwTypes = useSelector((state: RootState) => state.shared.throwTypes);
  const { athleteThrowRankings, athleteThrowOverallRankings, loading, filters } = useSelector((state: RootState) => state.throwRankings);
  const isOverallSelected = filters.throwTypeId === null;
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

      // Set throw type filter from URL param or default to null (Overall)
      if (throwTypeIdParam) {
        const throwTypeId = Number(throwTypeIdParam);
        if (!isNaN(throwTypeId) && throwTypes.some((tt) => tt.id === throwTypeId)) {
          dispatch(setThrowTypeFilter(throwTypeId));
        } else {
          dispatch(setThrowTypeFilter(null));
        }
      } else {
        dispatch(setThrowTypeFilter(null));
      }

      initializedRef.current = true;
    }
  }, [dispatch, throwTypes, classTypes, searchParams]);

  // Initial fetch after filters are initialized (only once)
  useEffect(() => {
    if (initializedRef.current && !hasInitialFetchRef.current) {
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
    // Only fetch if we've done the initial fetch
    if (hasInitialFetchRef.current) {
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
  const displayRankings = isOverallSelected
    ? (Array.isArray(athleteThrowOverallRankings)
        ? athleteThrowOverallRankings.filter((ranking) => {
            // If no class filter is selected (null or 0), show all throws
            if (!filters.classTypeId || filters.classTypeId === 0) {
              return true;
            }
            // Filter by the throw's class (classType.id)
            return ranking.classType?.id === filters.classTypeId;
          })
        : [])
    : (Array.isArray(athleteThrowRankings)
        ? athleteThrowRankings.filter((ranking) => {
            // If no class filter is selected (null or 0), show all throws
            if (!filters.classTypeId || filters.classTypeId === 0) {
              return true;
            }
            // Filter by the throw's class (classType.id), not the athlete's current class
            return ranking.classType?.id === filters.classTypeId;
          })
        : []);

  const getClassTypeName = (classTypeId: number | null): string => {
    if (!classTypeId) return "N/A";
    const classType = classTypes.find((ct) => ct.id === classTypeId);
    return classType?.name || `Class ${classTypeId}`;
  };

  const getUserName = (firstName: string | null, lastName: string | null): string => {
    if (lastName && firstName) {
      return `${firstName} ${lastName}`;
    }
    return firstName || lastName || "Unknown";
  };

  // Helper function to convert decimal distance (in feet) to feet and inches
  const convertFromDistance = (distance: number): { feet: number; inches: number } => {
    const feet = Math.floor(distance);
    const inches = Math.round((distance - feet) * 12);
    return { feet, inches };
  };

  // Prepare data for DataGrid with unique IDs
  const rows = isOverallSelected
    ? (displayRankings as AthleteThrowOverallRankingDto[]).map((ranking, index) => {
        // Create an object with throw data for each throwType
        const throwData: { [throwTypeId: number]: { distance: string; points: number | null } } = {};
        ranking.throws.forEach((throwItem) => {
          const { feet, inches } = convertFromDistance(throwItem.distance);
          throwData[throwItem.throwType.id] = {
            distance: `${feet}' ${inches}"`,
            points: throwItem.points,
          };
        });

        // Create row data with throw data for each throwType
        const rowData: any = {
          id: `${ranking.firstName}-${ranking.lastName}-overall-${index}`,
          rank: index + 1,
          athleteName: getUserName(ranking.firstName, ranking.lastName),
          userId: ranking.userId || null,
          totalPoints: ranking.totalPoints,
          throwClass: ranking.classType?.name || "N/A",
          usedThrowTypeIds: ranking.usedThrowTypeIds || [],
        };

        // Add throw data for each throwType
        throwTypes.forEach((throwType) => {
          rowData[`throw_${throwType.id}`] = throwData[throwType.id] || null;
        });

        return rowData;
      })
    : (displayRankings as AthleteThrowRankingDto[]).map((ranking, index) => {
        const { feet, inches } = convertFromDistance(ranking.distance);
        return {
          id: `${ranking.firstName}-${ranking.lastName}-${ranking.throwType.id}-${index}`,
          rank: index + 1,
          athleteName: getUserName(ranking.firstName, ranking.lastName),
          userId: ranking.userId || null,
          throwClass: ranking.classType?.name || "N/A",
          throwType: ranking.throwType.name,
          distance: ranking.distance,
          distanceDisplay: `${feet}' ${inches}"`,
          videoUrl: ranking.videoUrl,
        };
      });

  const columns: GridColDef[] = isOverallSelected
    ? [
        { field: "rank", headerName: "Rank", type: "number", width: 80, align: "center", headerAlign: "center" },
        { field: "totalPoints", headerName: "Total Points", type: "number", flex: 1, minWidth: 120 },
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
        // Dynamic columns for each throwType
        ...throwTypes.map((throwType) => ({
          field: `throw_${throwType.id}`,
          headerName: throwType.name,
          flex: 1,
          minWidth: 120,
          align: "center" as const,
          headerAlign: "center" as const,
          renderCell: (params: GridRenderCellParams) => {
            const throwData = params.value as { distance: string; points: number | null } | null;
            const usedThrowTypeIds = (params.row.usedThrowTypeIds as number[]) || [];
            const isDisabled = !usedThrowTypeIds.includes(throwType.id);

            if (!throwData) {
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 1,
                    opacity: isDisabled ? 0.6 : 1,
                    color: isDisabled ? "text.disabled" : "text.secondary",
                  }}
                >
                  <Typography variant="body2" color={isDisabled ? "text.disabled" : "text.secondary"}>
                    -
                  </Typography>
                </Box>
              );
            }
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 1,
                  opacity: isDisabled ? 0.6 : 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDisabled ? "text.disabled" : "text.primary",
                  }}
                >
                  {throwData.distance}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    color: isDisabled ? "text.disabled" : "text.secondary",
                  }}
                >
                  {throwData.points !== null ? `${throwData.points} pts` : "-"}
                </Typography>
              </Box>
            );
          },
        })),
        { field: "throwClass", headerName: "Class", flex: 1, minWidth: 150 },
      ]
    : [
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
                value={filters.throwTypeId ?? "overall"}
                label="Throw Type"
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch(setThrowTypeFilter(value === "overall" ? null : Number(value)));
                }}
              >
                <MenuItem value="overall">Overall</MenuItem>
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

