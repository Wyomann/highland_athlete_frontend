import { Card, CardContent, Box, Typography } from '@mui/material';
import { Sports } from '@mui/icons-material';
import type { AthleteThrow } from '../../models/athlete-throw';

interface AthleteThrowsProps {
  athleteThrows: AthleteThrow[];
}

function AthleteThrows({ athleteThrows }: AthleteThrowsProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Sports className="primary-blue" /> Athlete PR Throws
        </Typography>
        {athleteThrows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No throws recorded yet.
          </Typography>
        ) : (
          <Box>
            {athleteThrows.map((athleteThrow, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Throw Type ID: {athleteThrow.throwTypeId}
                </Typography>
                <Typography variant="body1">
                  Distance: {athleteThrow.distance}
                </Typography>
                {athleteThrow.isPr && (
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    Personal Record
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default AthleteThrows;

