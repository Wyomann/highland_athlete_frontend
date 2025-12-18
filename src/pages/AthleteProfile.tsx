import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, CircularProgress, Avatar, Divider, Stack } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { getUserById, clearSelectedAthlete } from "../slices/athletesSlice";
import type { AppDispatch, RootState } from "../app/store";
import type { AthleteThrow } from "../models/athlete-throw";
import type { AthleteLift } from "../models/athlete-lift";
import AthletePersonalInformation from "../components/athlete-profiles/AthletePersonalInformation";
import AthleteThrows from "../components/my-profile/AthleteThrows";
import AthleteLiftsView from "../components/athlete-profiles/AthleteLiftsView";

function AthleteProfile() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAthlete, selectedAthleteLoading, selectedAthleteError } = useSelector(
    (state: RootState) => state.athletes
  );

  // Fetch athlete by ID when component mounts or id changes
  useEffect(() => {
    if (id) {
      const userId = Number(id);
      if (!isNaN(userId)) {
        dispatch(getUserById(userId));
      }
    }

    // Clear selected athlete when component unmounts
    return () => {
      dispatch(clearSelectedAthlete());
    };
  }, [id, dispatch]);

  if (selectedAthleteLoading) {
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (selectedAthleteError || !selectedAthlete) {
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Athlete Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {selectedAthleteError || "The athlete profile you're looking for doesn't exist or has been removed."}
        </Typography>
      </Box>
    );
  }

  const displayName =
    selectedAthlete.lastName && selectedAthlete.firstName
      ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}`
      : selectedAthlete.firstName || selectedAthlete.lastName || "User";

  // Extract athlete lifts and throws from user object
  // These are included in the user object from the backend but not in the TypeScript interface
  const athleteLifts = ((selectedAthlete as any)?.athleteLifts || []) as AthleteLift[];
  const athleteThrows = ((selectedAthlete as any)?.athleteThrows || []) as AthleteThrow[];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar
          src={selectedAthlete.profileImageUrl || undefined}
          sx={{
            width: 120,
            height: 120,
            bgcolor: "primary.main",
            fontSize: "3rem",
            mb: 2,
          }}
        >
          {!selectedAthlete.profileImageUrl && <AccountCircle sx={{ width: 120, height: 120 }} />}
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          {displayName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile Information
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        {/* Left Column - Profile Information (1/3) */}
        <Box sx={{ width: { xs: "100%", md: "33.333%" }, flexShrink: 0 }}>
          <AthletePersonalInformation user={selectedAthlete} />
        </Box>

        {/* Right Column - Athlete Data (2/3) */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={3}>
            <AthleteThrows athleteThrows={athleteThrows} />
            <AthleteLiftsView athleteLifts={athleteLifts} />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default AthleteProfile;

