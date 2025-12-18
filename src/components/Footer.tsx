import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", py: 8, borderTop: 1, borderColor: "divider", width: "100%" }}>
      <Box sx={{ width: "100%", px: 3 }}>
        {/* <Grid container spacing={4}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
              Products
            </Typography>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Material UI
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Base UI
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              MUI X
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
              Resources
            </Typography>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Material Icons
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Templates
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Components
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Customization
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Design Kits
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
              Explore
            </Typography>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Documentation
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Store
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Blog
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Showcase
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Roadmap
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              About
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Vision
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Careers
            </Link>
            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Hiring
            </Link>
          </Grid>
        </Grid> */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Copyright © {new Date().getFullYear()} Highland Athlete.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link component={RouterLink} to="/terms-of-service" color="text.secondary" variant="body2" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Terms of Service
            </Link>
            <Link component={RouterLink} to="/privacy-policy" color="text.secondary" variant="body2" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Privacy policy
            </Link>
            <Link component={RouterLink} to="/data-deletion" color="text.secondary" variant="body2" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Data deletion
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;

