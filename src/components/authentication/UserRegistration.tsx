import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import ReCAPTCHA from 'react-google-recaptcha';
import { registerUser } from '../../slices/authenticationSlice';
import type { AppDispatch, RootState } from '../../app/store';
import { validateEmail, validatePassword, validatePasswordConfirmation, authModalStyle } from '../../utils/authUtils';
import FacebookAuthButton from './FacebookAuthButton';

interface UserRegistrationProps {
  open: boolean;
  onClose: () => void;
}

function UserRegistration({ open, onClose }: UserRegistrationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, user } = useSelector((state: RootState) => state.authentication);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Get reCAPTCHA site key from environment variable
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  // Track previous user state to detect new registrations
  const prevUserRef = useRef(user);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      });
      setValidationErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      setRecaptchaToken(null);
      setRecaptchaError('');
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      // Reset the previous user ref when modal opens
      prevUserRef.current = user;
    }
  }, [open, user]);
  
  // Close modal only on successful registration (when user changes from null to a user)
  useEffect(() => {
    // Only close if user just changed from null/undefined to a user object
    // and the modal is open (meaning we just registered)
    if (user && !prevUserRef.current && open) {
      onClose();
      // Redirect to MyProfile page
      navigate('/my-profile');
    }
    prevUserRef.current = user;
  }, [user, open, onClose, navigate]);

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

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

    // Password validation
    const passwordError = validatePassword(formData.password, { requireMinLength: true, minLength: 8 });
    if (passwordError) {
      errors.password = passwordError;
    }

    // Confirm password validation
    const confirmPasswordError = validatePasswordConfirmation(formData.password, formData.confirmPassword);
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      setRecaptchaError('');
    }
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
    setRecaptchaError('reCAPTCHA verification expired. Please verify again.');
  };

  const handleRecaptchaError = () => {
    setRecaptchaToken(null);
    setRecaptchaError('reCAPTCHA verification failed. Please try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Validate reCAPTCHA if site key is configured
    if (recaptchaSiteKey) {
      if (!recaptchaToken) {
        setRecaptchaError('Please complete the reCAPTCHA verification');
        return;
      }
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      recaptchaToken: recaptchaToken || undefined,
    };

    await dispatch(registerUser(userData));
    // Modal will close via useEffect watching user state on successful registration
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="registration-modal-title"
      aria-describedby="registration-modal-description"
    >
      <Box sx={authModalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography id="registration-modal-title" variant="h5" component="h2">
            Create Account
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon className="primary-blue" />
          </IconButton>
        </Box>

        <FacebookAuthButton label="Register with Facebook" />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            required
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            autoComplete="given-name"
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            autoComplete="family-name"
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            required
            fullWidth
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff className="primary-blue" /> : <Visibility className="primary-blue" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!validationErrors.confirmPassword}
            helperText={validationErrors.confirmPassword}
            required
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

          {recaptchaSiteKey && (
            <Box sx={{ mt: 2 }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
                onError={handleRecaptchaError}
              />
              {recaptchaError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {recaptchaError}
                </Alert>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              fullWidth
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default UserRegistration;

