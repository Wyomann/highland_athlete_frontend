import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Container, TextField, Button, Typography, CircularProgress, Paper, InputAdornment, IconButton, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "../slices/authenticationSlice";
import type { AppDispatch, RootState } from "../app/store";

function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.authentication);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidationErrors({
        password: "Reset token is missing. Please use the link from your email.",
      });
    }
  }, [token]);

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

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setValidationErrors({
        password: "Reset token is missing. Please use the link from your email.",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(resetPassword({ token, password: formData.password }));

    // If successful, show success message
    if (resetPassword.fulfilled.match(result)) {
      setSubmitted(true);
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Reset Password
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Reset token is missing. Please use the link from your email to reset your password.
          </Alert>
        </Paper>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Password Reset Successful
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 3, color: "text.secondary" }}>
              Your password has been successfully reset. You will be redirected to the home page shortly.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              Go to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reset Password
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary", textAlign: "center" }}>
          Please enter your new password below.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
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
                  <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
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
                  <IconButton aria-label="toggle confirm password visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 2 }}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ResetPassword;
