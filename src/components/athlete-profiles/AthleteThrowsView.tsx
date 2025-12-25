import { Card, CardContent, Box, Typography, IconButton, Divider } from "@mui/material";
import { Sports, Videocam } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { AthleteThrow } from "../../models/athlete-throw";
import type { RootState } from "../../app/store";

interface AthleteThrowsViewProps {
  athleteThrows: AthleteThrow[];
}

function AthleteThrowsView({ athleteThrows }: AthleteThrowsViewProps) {
  const throwTypes = useSelector((state: RootState) => state.shared.throwTypes);
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);

  // Helper function to convert decimal distance (in feet) to feet and inches
  const convertFromDistance = (distance: number): { feet: number; inches: number } => {
    const feet = Math.floor(distance);
    const inches = Math.round((distance - feet) * 12);
    return { feet, inches };
  };

  // Helper function to get throw type name by ID
  const getThrowTypeName = (throwTypeId: number): string => {
    const throwType = throwTypes.find((type) => type.id === throwTypeId);
    return throwType?.name || `Throw Type ${throwTypeId}`;
  };

  // Helper function to get class type name by ID
  const getClassTypeName = (classTypeId: number): string => {
    const classType = classTypes.find((type) => type.id === classTypeId);
    return classType?.name || `Class Type ${classTypeId}`;
  };

  // Filter throws by PR (only show PRs) and group by class type
  const prThrowsByClassType: { [classTypeId: number]: AthleteThrow[] } = {};
  athleteThrows
    .filter((throwItem) => throwItem.isPr)
    .forEach((throwItem) => {
      if (!prThrowsByClassType[throwItem.classTypeId]) {
        prThrowsByClassType[throwItem.classTypeId] = [];
      }
      prThrowsByClassType[throwItem.classTypeId].push(throwItem);
    });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Sports className="primary-blue" /> Athlete PR Throws
        </Typography>
        {athleteThrows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No throws recorded yet.
          </Typography>
        ) : Object.keys(prThrowsByClassType).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No PRs recorded yet.
          </Typography>
        ) : (
          <Box>
            {Object.entries(prThrowsByClassType)
              .sort(([aId], [bId]) => {
                const aName = getClassTypeName(Number(aId)).toLowerCase();
                const bName = getClassTypeName(Number(bId)).toLowerCase();
                return aName.localeCompare(bName);
              })
              .map(([classTypeId, throws], classIndex) => {
                const sortedThrows = [...throws].sort((a, b) => {
                  const aName = getThrowTypeName(a.throwTypeId).toLowerCase();
                  const bName = getThrowTypeName(b.throwTypeId).toLowerCase();
                  return aName.localeCompare(bName);
                });
                return (
                  <Box key={classTypeId}>
                    {classIndex > 0 && <Divider sx={{ my: 3 }} />}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        {getClassTypeName(Number(classTypeId))}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {sortedThrows.map((athleteThrow) => {
                          const { feet, inches } = convertFromDistance(athleteThrow.distance);
                          return (
                            <Box
                              key={athleteThrow.id}
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
                                {getThrowTypeName(athleteThrow.throwTypeId)}
                              </Typography>
                              {(() => {
                                const throwTypeName = getThrowTypeName(athleteThrow.throwTypeId);
                                const isCaber = throwTypeName.toLowerCase() === "caber";
                                
                                if (isCaber) {
                                  return (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                                      <Typography variant="body1">
                                        Length:{" "}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                          {feet}' {inches}"
                                        </Box>
                                        {athleteThrow.weight && (
                                          <>
                                            {" "}
                                            <Box component="span" sx={{ fontWeight: 600 }}>
                                              {athleteThrow.weight} lbs
                                            </Box>
                                          </>
                                        )}
                                      </Typography>
                                      {athleteThrow.score && (
                                        <Typography variant="body1">
                                          Score:{" "}
                                          <Box component="span" sx={{ fontWeight: 600 }}>
                                            {athleteThrow.score}
                                          </Box>
                                        </Typography>
                                      )}
                                      {athleteThrow.videoUrl && (
                                        <IconButton component="a" href={athleteThrow.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                                          <Videocam className="primary-blue" />
                                        </IconButton>
                                      )}
                                    </Box>
                                  );
                                }
                                
                                return (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body1">
                                      Distance:{" "}
                                      <Box component="span" sx={{ fontWeight: 600 }}>
                                        {feet}' {inches}"
                                      </Box>
                                    </Typography>
                                    {athleteThrow.videoUrl && (
                                      <IconButton component="a" href={athleteThrow.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                                        <Videocam className="primary-blue" />
                                      </IconButton>
                                    )}
                                  </Box>
                                );
                              })()}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default AthleteThrowsView;

