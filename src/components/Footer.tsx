import { Box, Container, Grid, Link, Typography } from "@mui/material";

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", py: 8, borderTop: 1, borderColor: "divider", width: "100%" }}>
      <Container sx={{ width: "100%" }}>
        <Grid container spacing={4}>
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
        </Grid>
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
            Copyright © {new Date().getFullYear()} Material UI SAS, trading as MUI.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" color="text.secondary" variant="body2">
              Support
            </Link>
            <Link href="#" color="text.secondary" variant="body2">
              Privacy policy
            </Link>
            <Link href="#" color="text.secondary" variant="body2">
              Contact us
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;

