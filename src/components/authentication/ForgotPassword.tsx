import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { forgotPassword } from '../../slices/authenticationSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

function ForgotPassword({ open, onClose }: ForgotPasswordProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.authentication);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setEmail('');
      setEmailError('');
      setSubmitted(false);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear validation error when user types
    if (emailError) {
      setEmailError('');
    }
  };

  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    const result = await dispatch(forgotPassword({ email }));
    
    // If successful, show success message
    if (forgotPassword.fulfilled.match(result)) {
      setSubmitted(true);
    }
  };

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    maxHeight: '90vh',
    overflow: 'auto',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="forgot-password-modal-title"
      aria-describedby="forgot-password-modal-description"
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography id="forgot-password-modal-title" variant="h5" component="h2">
            Forgot Password
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon className="primary-blue" />
          </IconButton>
        </Box>

        {!submitted ? (
          <>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Enter your email address and we'll send you a link to reset your password.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
                required
                fullWidth
                autoComplete="email"
                disabled={loading}
              />

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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              If an account with that email exists, we've sent a password reset link to <strong>{email}</strong>.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Please check your email and follow the instructions to reset your password.
            </Typography>
            <Button
              variant="contained"
              onClick={onClose}
              fullWidth
            >
              Close
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default ForgotPassword;

