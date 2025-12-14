import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../app/store';
import type { AthleteThrow } from '../models/athlete-throw';
import type { AthleteLift } from '../models/athlete-lift';
import { fetchUser } from '../slices/authenticationSlice';
import PersonalInformation from '../components/profile/PersonalInformation';
import AthleteThrows from '../components/profile/AthleteThrows';
import AthleteLifts from '../components/profile/AthleteLifts';

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.authentication);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Not Authenticated
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please log in to view your profile.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const displayName = user.lastName && user.firstName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.lastName || 'User';

  // Extract athlete lifts and throws from user object
  // These are included in the user object from the backend but not in the TypeScript interface
  const athleteLifts = ((user as any)?.athleteLifts || []) as AthleteLift[];
  const athleteThrows = ((user as any)?.athleteThrows || []) as AthleteThrow[];

  // Handle lift added callback - refetch user to get updated data
  const handleLiftAdded = () => {
    dispatch(fetchUser());
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={user.profileImageUrl || undefined}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
          >
            {user.profileImageUrl ? null : (
              <AccountCircle sx={{ width: 120, height: 120 }} />
            )}
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            {displayName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Profile Information
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Column - Profile Information (1/3) */}
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, flexShrink: 0 }}>
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
