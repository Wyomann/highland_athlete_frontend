import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

function Header() {
  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: { xs: 1, sm: 0 } }}>
          MUI
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, mr: 6 }}>
            <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500 }}>
              Products
            </Link>
            <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500 }}>
              Docs
            </Link>
            <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500 }}>
              Pricing
            </Link>
            <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500 }}>
              About us
            </Link>
            <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500 }}>
              Blog
            </Link>
          </Box>
          <Button startIcon={<AccountCircle />} sx={{ display: { xs: "none", sm: "flex" } }}>
            My Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

