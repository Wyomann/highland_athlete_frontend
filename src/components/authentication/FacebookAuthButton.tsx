import { Box, Button, Typography } from '@mui/material';
import { Facebook } from '@mui/icons-material';
import { getFacebookOAuthConfig, handleFacebookOAuth, facebookButtonStyle } from '../../utils/authUtils';

interface FacebookAuthButtonProps {
  label: string;
}

/**
 * Reusable Facebook authentication button with OR divider
 */
function FacebookAuthButton({ label }: FacebookAuthButtonProps) {
  const { facebookAppId } = getFacebookOAuthConfig();

  if (!facebookAppId) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        type="button"
        variant="outlined"
        fullWidth
        onClick={handleFacebookOAuth}
        startIcon={<Facebook />}
        sx={{
          ...facebookButtonStyle,
          '& .MuiButton-startIcon': {
            '& svg': {
              fontSize: '24px',
            },
          },
        }}
      >
        {label}
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
          OR
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
      </Box>
    </Box>
  );
}

export default FacebookAuthButton;

