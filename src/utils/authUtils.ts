/**
 * Authentication utility functions shared across authentication components
 */

/**
 * Get Facebook OAuth configuration from environment variables
 */
export const getFacebookOAuthConfig = () => {
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || "";
  const facebookRedirectUri = import.meta.env.VITE_FACEBOOK_REDIRECT_URI || "";

  return {
    facebookAppId,
    facebookRedirectUri,
  };
};

/**
 * Handle Facebook OAuth login/registration redirect
 */
export const handleFacebookOAuth = () => {
  const { facebookAppId, facebookRedirectUri } = getFacebookOAuthConfig();

  if (!facebookAppId) {
    console.error("Facebook App ID is not configured");
    return;
  }

  const facebookAuthUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  facebookAuthUrl.searchParams.set("client_id", facebookAppId);
  facebookAuthUrl.searchParams.set("redirect_uri", facebookRedirectUri);
  facebookAuthUrl.searchParams.set("scope", "email,public_profile");
  facebookAuthUrl.searchParams.set("response_type", "code");

  // Redirect to Facebook OAuth
  window.location.href = facebookAuthUrl.toString();
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

/**
 * Validate password
 * @param password - The password to validate
 * @param options - Validation options
 * @param options.requireMinLength - Whether to require minimum length (default: false)
 * @param options.minLength - Minimum password length (default: 8)
 */
export const validatePassword = (password: string, options: { requireMinLength?: boolean; minLength?: number } = {}): string | undefined => {
  const { requireMinLength = false, minLength = 8 } = options;

  if (!password) {
    return "Password is required";
  }
  if (requireMinLength && password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return undefined;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
};

/**
 * Common modal style for authentication modals
 */
export const authModalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxHeight: "90vh",
  overflow: "auto",
};

/**
 * Facebook button styling
 */
export const facebookButtonStyle = {
  mb: 2,
  textTransform: "none" as const,
  borderColor: "#1877F2",
  color: "#1877F2",
  "&:hover": {
    borderColor: "#166FE5",
    backgroundColor: "rgba(24, 119, 242, 0.04)",
  },
};
