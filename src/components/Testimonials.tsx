import { Box, Container, Paper, Typography, Avatar, Grid } from "@mui/material";

const testimonials = [
  {
    text: "We've relied on Material UI really heavily. I override a lot of default styles to try and make things our own, but the time we save with complex components like the Autocomplete and the Data Grid are so worth it. Every other library I try has 80% of what I'm looking for when it comes to complex use cases, Material UI has it all under one roof which is a huge help for our small team.",
    author: "Kyle Gill",
    role: "Engineer & Designer",
    company: "Particl",
  },
  {
    text: "Material UI looks great and lets us deliver fast, thanks to their solid API design and documentation - it's refreshing to use a component library where you get everything you need from their site rather than Stack Overflow. We think the upcoming version, with extra themes and customizability, will make Material UI even more of a game changer. We're extremely grateful to the team for the time and effort spent maintaining the project.",
    author: "Jean-Laurent de Morlhon",
    role: "VP of Engineering",
    company: "Docker",
  },
];

function Testimonials() {
  return (
    <Box sx={{ bgcolor: "background.default", paddingBottom: 6, width: "100%" }}>
      <Container sx={{ width: "100%" }}>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Paper sx={{ p: 4, height: "100%" }} elevation={2}>
                <Typography variant="body1" color="text.primary" paragraph sx={{ fontStyle: "italic", mb: 3 }}>
                  "{testimonial.text}"
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>{testimonial.author.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {testimonial.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {testimonial.company} logo
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Testimonials;

