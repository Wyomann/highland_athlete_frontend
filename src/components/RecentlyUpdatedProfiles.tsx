import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Avatar, Grid, CircularProgress, IconButton } from "@mui/material";
import { AccountCircle, Facebook, Instagram } from "@mui/icons-material";
import { getRecentUsers } from "../slices/athletesSlice";
import type { AppDispatch, RootState } from "../app/store";

function RecentlyUpdatedProfiles() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { recentUsers, recentUsersLoading } = useSelector((state: RootState) => state.athletes);
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);

  useEffect(() => {
    dispatch(getRecentUsers(2)); // Fetch 2 recent users
  }, [dispatch]);

  // Get class type name
  const getClassTypeName = (classTypeId: number | null): string => {
    if (!classTypeId) return "Athlete";
    const classType = classTypes.find((ct) => ct.id === classTypeId);
    return classType?.name || "Athlete";
  };

  // Get display name
  const getDisplayName = (firstName: string | null, lastName: string | null): string => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return firstName || lastName || "Athlete";
  };

  // Get initials for avatar
  const getInitials = (firstName: string | null, lastName: string | null): string => {
    const first = firstName?.charAt(0).toUpperCase() || "";
    const last = lastName?.charAt(0).toUpperCase() || "";
    return first + last || "A";
  };

  // Get time since update
  const getTimeSinceUpdate = (updatedAt: string | null): string => {
    if (!updatedAt) return "Unknown";
    
    const updateDate = new Date(updatedAt);
    const now = new Date();
    const diffInMs = now.getTime() - updateDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInHours < 24) {
      return "Recently";
    }
    
    if (diffInDays === 1) {
      return "1 day ago";
    }
    
    return `${diffInDays} days ago`;
  };

  if (recentUsersLoading) {
    return (
      <Box sx={{ bgcolor: "background.default", paddingBottom: 6, width: "100%", display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (recentUsers.length === 0) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: "background.default", paddingBottom: 6, width: "100%" }}>
      <Typography
          component="h2"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 700, fontSize: { xs: "1.75rem", md: "3rem" } }}
        >
          Recently updated profiles
        </Typography>
      <Box sx={{ width: "100%", px: 3 }}>
        <Grid container spacing={4}>
          {recentUsers.map((user) => {
            const handleCardClick = () => {
              navigate(`/athletes/${user.id}`);
            };

            return (
              <Grid size={{ xs: 6, md: 3 }} key={user.id}>
                <Paper
                  sx={{
                    p: 2,
                    height: "100%",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    transition: "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      elevation: 4,
                      backgroundColor: "action.hover",
                    },
                  }}
                  elevation={2}
                  onClick={handleCardClick}
                >
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: { xs: "flex-start", md: "space-between" }, alignItems: { xs: "flex-start", md: "flex-start" }, gap: 2, flex: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "center", md: "center" }, gap: 2, width: "100%" }}>
                      <Avatar
                        src={user.profileImageUrl || undefined}
                        sx={{ 
                          bgcolor: "primary.main",
                          width: 96,
                          height: 96,
                          fontSize: "2.25rem"
                        }}
                      >
                        {!user.profileImageUrl && (user.firstName || user.lastName ? (
                          getInitials(user.firstName, user.lastName)
                        ) : (
                          <AccountCircle sx={{ width: 96, height: 96 }} />
                        ))}
                      </Avatar>
                      <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: "1.25rem" }}>
                          {getDisplayName(user.firstName, user.lastName)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "1rem" }}>
                          {getClassTypeName(user.currentClassTypeId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                          Highland Athlete
                        </Typography>
                      </Box>
                    </Box>
                    {(user.facebookUrl || user.instagramUrl) && (
                      <Box sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, gap: 0.5, alignSelf: { xs: "flex-start", md: "flex-start" } }} onClick={(e) => e.stopPropagation()}>
                        {user.facebookUrl && (
                          <IconButton
                            component="a"
                            href={user.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook profile"
                            size="small"
                            sx={{ 
                              color: "#1877F2",
                              "& svg": { 
                                fontSize: "2.25rem" 
                              }
                            }}
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
                            sx={{ 
                              color: "#E4405F",
                              "& svg": { 
                                fontSize: "2.25rem" 
                              }
                            }}
                          >
                            <Instagram />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ mt: "16px", pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.875rem", textAlign: "center", display: "block" }}>
                      Profile Updated - {getTimeSinceUpdate(user.updatedAt)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default RecentlyUpdatedProfiles;

