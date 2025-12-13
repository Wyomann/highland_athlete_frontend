import { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import Testimonials from "../components/Testimonials";
import UserRegistration from "../components/authentication/UserRegistration";
import UserLogin from "../components/authentication/UserLogin";
import haBackground from "../assets/images/ha_background.png";

function Home() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <Container
        maxWidth={false}
        sx={{
          margin: 0,
          borderRadius: 0,
          maxWidth: "100% !important",
          mb: 8,
          textAlign: "center",
          width: "100%",
          backgroundImage: `url(${haBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          py: { xs: 8, md: 12 },
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 0,
          },
          "& > *": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Typography
            component="h3"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "white",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              fontSize: { xs: "1.75rem", md: "3rem" },
            }}
          >
            Highland Athlete Profiles and Rankings
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{
              mt: 3,
              mb: 4,
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
              fontSize: { xs: "1rem", md: "1.5rem" },
            }}
          >
            Track your perosnal records, compete in rankings, and connect with fellow athletes who share your passion for throwing cabers, hammers, stones, and
            weights for distance.
          </Typography>
        </Box>
      </Container>

      {/* Join the Community Section */}
      <Container sx={{ py: 2, width: "100%" }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 700, fontSize: { xs: "1.75rem", md: "3rem" } }}
        >
          Join the community
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 8 }}>
          <Button variant="contained" size="large" onClick={() => setRegistrationOpen(true)} sx={{ px: 4, py: 1.5 }}>
            Register
          </Button>
          <Button variant="outlined" size="large" onClick={() => setLoginOpen(true)} sx={{ px: 4, py: 1.5 }}>
            Login
          </Button>
        </Box>
      </Container>

      <Testimonials />

      <UserRegistration open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
      <UserLogin open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default Home;
