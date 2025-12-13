import { useState } from "react";
import { Box, Container, CssBaseline, ThemeProvider, Typography, createTheme, Grid, Button } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import UserRegistration from "../components/authentication/UserRegistration";
import UserLogin from "../components/authentication/UserLogin";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

const communityStats = [
  { value: "5.8M", label: "Weekly downloads on npm" },
  { value: "93.9k", label: "Stars on GitHub" },
  { value: "3.0k", label: "Open-source contributors" },
  { value: "19.2k", label: "Followers on X" },
];

function Home() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />

      {/* Hero Section */}
      <Container sx={{ mt: { xs: 6, md: 12 }, mb: 8, textAlign: "center", width: "100%" }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 700, fontSize: { xs: "2.5rem", md: "3.75rem" } }}
        >
          Move faster
          <br />
          with intuitive React UI tools
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mt: 3, mb: 4 }}>
          MUI offers a comprehensive suite of free UI tools to help you ship new features faster. Start with Material UI, our fully-loaded component library, or
          bring your own design system to our production-ready components.
        </Typography>
      </Container>

      {/* Join the Community Section */}
      <Container sx={{ py: 12, width: "100%" }}>
        <Typography component="h2" variant="h4" align="center" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
          Join the community
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setRegistrationOpen(true)}
            sx={{ px: 4, py: 1.5 }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setLoginOpen(true)}
            sx={{ px: 4, py: 1.5 }}
          >
            Login
          </Button>
        </Box>
        <Grid container spacing={4}>
          {communityStats.map((stat, index) => (
            <Grid size={{ xs: 6, sm: 3 }} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" component="div" color="primary.main" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Testimonials />

      <Footer />

      <UserRegistration open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
      <UserLogin open={loginOpen} onClose={() => setLoginOpen(false)} />
    </ThemeProvider>
  );
}

export default Home;
