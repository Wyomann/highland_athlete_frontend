import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Email,
  Person,
  Facebook,
  Instagram,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Lock,
} from '@mui/icons-material';
import { updateUser } from '../../slices/authenticationSlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { User } from '../../models/user';

interface PersonalInformationProps {
  user: User;
}

function PersonalInformation({ user }: PersonalInformationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.authentication);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    facebookUrl: '',
    instagramUrl: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Initialize form data from user
  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      facebookUrl: user.facebookUrl || '',
      instagramUrl: user.instagramUrl || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  // Reset form when canceling edit
  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      facebookUrl: user.facebookUrl || '',
      instagramUrl: user.instagramUrl || '',
      password: '',
      confirmPassword: '',
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof validationErrors];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.confirmPassword) {
      errors.confirmPassword = 'Please enter a password';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updateData: {
      firstName?: string | null;
      lastName?: string | null;
      facebookUrl?: string | null;
      instagramUrl?: string | null;
      password?: string;
    } = {
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      facebookUrl: formData.facebookUrl || null,
      instagramUrl: formData.instagramUrl || null,
    };

    // Only include password if it was provided
    if (formData.password) {
      updateData.password = formData.password;
    }

    const result = await dispatch(updateUser(updateData));

    if (updateUser.fulfilled.match(result)) {
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setValidationErrors({});
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person /> Personal Information
          </Typography>
          {!isEditing ? (
            <Button
              startIcon={<Edit />}
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<Cancel />}
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            autoComplete="given-name"
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            autoComplete="family-name"
          />

          <TextField
            label="Email"
            name="email"
            value={user.email}
            disabled
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            helperText="Email cannot be changed"
          />

          <TextField
            label="Facebook URL"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            placeholder="https://facebook.com/yourprofile"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Facebook />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Instagram URL"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            placeholder="https://instagram.com/yourprofile"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Instagram />
                </InputAdornment>
              ),
            }}
          />

          {isEditing && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Lock fontSize="small" /> Change Password (optional)
                </Typography>
                <TextField
                  label="New Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                  fullWidth
                  autoComplete="new-password"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!validationErrors.confirmPassword}
                  helperText={validationErrors.confirmPassword}
                  fullWidth
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default PersonalInformation;

