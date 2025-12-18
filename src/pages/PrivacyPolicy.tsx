import { Box, Container, Typography, Paper } from "@mui/material";
import { PrivacyTip } from "@mui/icons-material";

function PrivacyPolicy() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <PrivacyTip className="primary-blue" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Privacy Policy
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Data Usage and Ownership
          </Typography>
          <Typography variant="body1" paragraph>
            By using Highland Athlete, you acknowledge and agree that all data you provide, including but not limited to personal information, profile data, lift records, throw records, images, videos, and any other content you submit, may be used by Highland Athlete in any manner we deem appropriate.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Use of Your Data
          </Typography>
          <Typography variant="body1" paragraph>
            Highland Athlete reserves the right to use, display, modify, distribute, and otherwise utilize all data and content you provide through our platform for any purpose, including but not limited to:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <Typography component="li" variant="body1" paragraph>
              Displaying your profile information, records, and achievements on the platform
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Creating rankings, leaderboards, and statistical analyses
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Marketing and promotional materials
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Sharing information with third parties as we see fit
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Any other use that Highland Athlete determines is in the best interest of the platform or community
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            No Restrictions
          </Typography>
          <Typography variant="body1" paragraph>
            You understand and agree that Highland Athlete is under no obligation to restrict, limit, or protect your data in any specific way. We may use your data without prior notice or consent for any lawful purpose.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Acceptance
          </Typography>
          <Typography variant="body1" paragraph>
            By creating an account and using Highland Athlete, you accept this Privacy Policy and agree to the terms outlined above. If you do not agree with these terms, you should not use our platform.
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: "italic" }}>
            If you have any questions about this Privacy Policy, please contact us through the platform.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default PrivacyPolicy;

