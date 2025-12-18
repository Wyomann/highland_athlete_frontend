import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Paper, Box, Typography, Avatar, Divider, Button, Stack, IconButton, CircularProgress } from "@mui/material";
import { AccountCircle, CameraAlt } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../app/store";
import type { AthleteThrow } from "../models/athlete-throw";
import type { AthleteLift } from "../models/athlete-lift";
import { fetchUser, uploadProfileImage } from "../slices/authenticationSlice";
import PersonalInformation from "../components/my-profile/PersonalInformation";
import AthleteThrows from "../components/my-profile/AthleteThrows";
import AthleteLifts from "../components/my-profile/AthleteLifts";

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.authentication);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Not Authenticated
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please log in to view your profile.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const displayName = user.lastName && user.firstName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || "User";

  // Extract athlete lifts and throws from user object
  // These are included in the user object from the backend but not in the TypeScript interface
  const athleteLifts = ((user as any)?.athleteLifts || []) as AthleteLift[];
  const athleteThrows = ((user as any)?.athleteThrows || []) as AthleteThrow[];

  // Handle lift added callback - refetch user to get updated data
  const handleLiftAdded = () => {
    dispatch(fetchUser());
  };

  // Handle profile image upload
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      await dispatch(uploadProfileImage(file)).unwrap();
      // Optionally refetch user to ensure we have the latest data
      await dispatch(fetchUser());
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload profile image");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Box sx={{ position: "relative", mb: 2 }}>
          <Avatar
            src={user.profileImageUrl || undefined}
            sx={{
              width: 120,
              height: 120,
              bgcolor: "primary.main",
              fontSize: "3rem",
            }}
          >
            {!user.profileImageUrl && <AccountCircle sx={{ width: 120, height: 120 }} />}
          </Avatar>
          <IconButton
            onClick={handleImageUploadClick}
            disabled={uploading || loading}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              border: "2px solid white",
            }}
            size="small"
          >
            {uploading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <CameraAlt />}
          </IconButton>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        </Box>
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
          <PersonalInformation user={user} />
        </Box>

        {/* Right Column - Athlete Data (2/3) */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={3}>
            <AthleteThrows athleteThrows={athleteThrows} />
            <AthleteLifts athleteLifts={athleteLifts} onLiftAdded={handleLiftAdded} />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default MyProfile;
