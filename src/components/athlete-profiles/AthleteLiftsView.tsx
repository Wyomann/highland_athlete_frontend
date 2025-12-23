import { Card, CardContent, Box, Typography, IconButton, Divider } from "@mui/material";
import { FitnessCenter, Videocam } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { AthleteLift } from "../../models/athlete-lift";
import type { RootState } from "../../app/store";

interface AthleteLiftsViewProps {
  athleteLifts: AthleteLift[];
}

function AthleteLiftsView({ athleteLifts }: AthleteLiftsViewProps) {
  const liftTypes = useSelector((state: RootState) => state.shared.liftTypes);

  // Helper function to get lift type name by ID
  const getLiftTypeName = (liftTypeId: number): string => {
    const liftType = liftTypes.find((lt) => lt.id === liftTypeId);
    return liftType?.name || `Lift Type ${liftTypeId}`;
  };

  // Filter lifts by PR type
  const allTimePRs = athleteLifts.filter((lift) => lift.isPr);
  const currentPRs = athleteLifts.filter((lift) => lift.isCurrentPr);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <FitnessCenter className="primary-blue" /> Athlete PR Lifts
        </Typography>
        {athleteLifts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No lifts recorded yet.
          </Typography>
        ) : (
          <Box>
            {/* All Time PRs */}
            {allTimePRs.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  All Time PRs
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {allTimePRs.map((lift, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        position: "relative",
                        width: 300,
                        minWidth: 300,
                        boxSizing: "border-box",
                        flex: "0 1 300px",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {getLiftTypeName(lift.liftTypeId)}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body1">
                          Weight:{" "}
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            {Math.floor(lift.weight)}
                          </Box>
                        </Typography>
                        {lift.videoUrl && (
                          <IconButton component="a" href={lift.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                            <Videocam className="primary-blue" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {allTimePRs.length > 0 && currentPRs.length > 0 && <Divider sx={{ my: 3 }} />}

            {/* Current PRs */}
            {currentPRs.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Current PRs
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {currentPRs.map((lift, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        position: "relative",
                        width: 300,
                        minWidth: 300,
                        boxSizing: "border-box",
                        flex: "0 1 300px",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {getLiftTypeName(lift.liftTypeId)}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body1">
                          Weight:{" "}
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            {Math.floor(lift.weight)}
                          </Box>
                        </Typography>
                        {lift.videoUrl && (
                          <IconButton component="a" href={lift.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                            <Videocam className="primary-blue" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default AthleteLiftsView;

