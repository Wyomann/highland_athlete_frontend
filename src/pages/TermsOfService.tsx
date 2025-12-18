import { Box, Container, Typography, Paper } from "@mui/material";
import { Description } from "@mui/icons-material";

function TermsOfService() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <Description className="primary-blue" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Terms of Service
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Highland Athlete, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Use License
          </Typography>
          <Typography variant="body1" paragraph>
            Permission is granted to temporarily use Highland Athlete for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <Typography component="li" variant="body1" paragraph>
              Modify or copy the materials
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Use the materials for any commercial purpose or for any public display
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Attempt to reverse engineer any software contained on Highland Athlete
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Remove any copyright or other proprietary notations from the materials
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            User Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. Highland Athlete reserves the right to refuse service, terminate accounts, or remove or edit content at our sole discretion.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            User Content
          </Typography>
          <Typography variant="body1" paragraph>
            You retain ownership of any content you submit to Highland Athlete. However, by submitting content, you grant Highland Athlete a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Prohibited Uses
          </Typography>
          <Typography variant="body1" paragraph>
            You may not use Highland Athlete:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <Typography component="li" variant="body1" paragraph>
              In any way that violates any applicable national or international law or regulation
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              To transmit, or procure the sending of, any advertising or promotional material without our prior written consent
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              To impersonate or attempt to impersonate Highland Athlete, a Highland Athlete employee, another user, or any other person or entity
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            The materials on Highland Athlete are provided on an 'as is' basis. Highland Athlete makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Limitations
          </Typography>
          <Typography variant="body1" paragraph>
            In no event shall Highland Athlete or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Highland Athlete, even if Highland Athlete or a Highland Athlete authorized representative has been notified orally or in writing of the possibility of such damage.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Revisions
          </Typography>
          <Typography variant="body1" paragraph>
            Highland Athlete may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </Typography>


          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: "italic" }}>
            If you have any questions about these Terms of Service, please contact us through the platform.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default TermsOfService;

