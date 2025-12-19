import { Box, Container, Typography, Paper } from "@mui/material";
import { Delete } from "@mui/icons-material";

function DataDeletion() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <Delete className="primary-blue" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Data Deletion
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Facebook Data Deletion
          </Typography>
          <Typography variant="body1" paragraph>
            If you logged into our app using Facebook and would like your Facebook-related data deleted:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <Typography component="li" variant="body1" paragraph>
              Email us at <strong>dankwilliams1980@gmail.com</strong>
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Include your Facebook User ID or the email associated with your account
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              We will delete all data obtained from Facebook within 7 business days
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: "italic" }}>
            If you have any questions about data deletion, please contact us through the platform.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default DataDeletion;


