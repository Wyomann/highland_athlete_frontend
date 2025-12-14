import { Card, CardContent, Box, Typography } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import type { AthleteLift } from '../../models/athlete-lift';

interface AthleteLiftsProps {
  athleteLifts: AthleteLift[];
}

function AthleteLifts({ athleteLifts }: AthleteLiftsProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FitnessCenter /> Athlete Lifts
        </Typography>
        {athleteLifts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No lifts recorded yet.
          </Typography>
        ) : (
          <Box>
            {athleteLifts.map((athleteLift, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Lift Type ID: {athleteLift.liftTypeId}
                </Typography>
                <Typography variant="body1">
                  Weight: {athleteLift.weight}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default AthleteLifts;

