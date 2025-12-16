import { useState, useEffect } from 'react';
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
  Link,
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser, fetchUser } from '../../slices/authenticationSlice';
import type { AppDispatch, RootState } from '../../app/store';
import ForgotPassword from './ForgotPassword';
import { validateEmail, validatePassword, authModalStyle } from '../../utils/authUtils';
import FacebookAuthButton from './FacebookAuthButton';

interface UserLoginProps {
  open: boolean;
  onClose: () => void;
}

function UserLogin({ open, onClose }: UserLoginProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.authentication);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        email: '',
        password: '',
      });
      setValidationErrors({});
      setShowPassword(false);
    }
  }, [open]);

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
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials = {
      email: formData.email,
      password: formData.password,
    };

    const result = await dispatch(loginUser(credentials));
    
    // On successful login, fetch user to ensure session is established and state is updated
    if (loginUser.fulfilled.match(result)) {
      // Fetch user to ensure session cookies are set and user state is fully updated
      await dispatch(fetchUser());
      onClose();
      // Redirect to MyProfile page
      navigate('/my-profile');
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box sx={authModalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography id="login-modal-title" variant="h5" component="h2">
              Sign In
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon className="primary-blue" />
            </IconButton>
          </Box>

          <FacebookAuthButton label="Login with Facebook" />

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
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              required
              fullWidth
              autoComplete="current-password"
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  setForgotPasswordOpen(true);
                }}
                sx={{ cursor: 'pointer' }}
              >
                Forgot Password?
              </Link>
            </Box>

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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <ForgotPassword
        open={forgotPasswordOpen}
        onClose={() => {
          setForgotPasswordOpen(false);
          onClose();
        }}
      />
    </>
  );
}

export default UserLogin;

