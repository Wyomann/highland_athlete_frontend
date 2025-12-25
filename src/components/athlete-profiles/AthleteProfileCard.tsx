import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box, Typography, Avatar, Divider, IconButton, CardActionArea } from "@mui/material";
import { AccountCircle, Email, Facebook, Instagram } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { User } from "../../models/user";
import type { RootState } from "../../app/store";

interface AthleteProfileProps {
  user: User;
}

// Helper functions
const inchesToFeetAndInches = (inches: number | null): { feet: number; inches: number } => {
  if (!inches) return { feet: 0, inches: 0 };
  return {
    feet: Math.floor(inches / 12),
    inches: inches % 12,
  };
};

const calculateAge = (dateOfBirth: string | null): number | null => {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Athlete Profile Card Component
 * Displays profile image and basic information for an athlete
 */
function AthleteProfile({ user }: AthleteProfileProps) {
  const navigate = useNavigate();
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);

  const handleCardClick = () => {
    navigate(`/athletes/${user.id}`);
  };

  // Get display name
  const displayName = user.lastName && user.firstName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || "User";

  // Get class type name
  const getClassTypeName = (classTypeId: number | null): string => {
    if (!classTypeId) return "N/A";
    const classType = classTypes.find((ct) => ct.id === classTypeId);
    return classType?.name || `Class ${classTypeId}`;
  };

  // Format height
  const formatHeight = (): string => {
    if (!user.height) return "N/A";
    const { feet, inches } = inchesToFeetAndInches(user.height);
    return `${feet}'${inches}"`;
  };

  // Format weight
  const formatWeight = (): string => {
    if (!user.weight) return "N/A";
    return `${Math.floor(user.weight)} lbs`;
  };

  // Calculate age
  const age = calculateAge(user.dateOfBirth);
  const formatAge = (): string => {
    if (age === null) return "N/A";
    return `${age} years old`;
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }} onClick={handleCardClick}>
      <CardActionArea sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        {/* Profile Image and Name */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user.profileImageUrl || undefined}
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2.5rem",
              mb: 2,
            }}
          >
            {!user.profileImageUrl && <AccountCircle sx={{ width: 100, height: 100 }} />}
          </Avatar>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, textAlign: "center" }}>
            {displayName}
          </Typography>
          {user.currentClassTypeId && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {getClassTypeName(user.currentClassTypeId)}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Basic Information */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {/* Height, Weight, Age */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Height:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatHeight()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Weight:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatWeight()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Age:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatAge()}
              </Typography>
            </Box>
          </Box>

          {/* Social Media Links */}
          {(user.facebookUrl || user.instagramUrl) && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                {user.facebookUrl && (
                  <IconButton
                    component="a"
                    href={user.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook profile"
                    size="small"
                    sx={{ color: "#1877F2" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Facebook />
                  </IconButton>
                )}
                {user.instagramUrl && (
                  <IconButton
                    component="a"
                    href={user.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram profile"
                    size="small"
                    sx={{ color: "#E4405F" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram />
                  </IconButton>
                )}
              </Box>
            </>
          )}
        </Box>
      </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default AthleteProfile;
