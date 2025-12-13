import { useState } from "react";
import { useSelector } from "react-redux";
import { AppBar, Box, Button, Link, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { AccountCircle, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import SideMenu from "./SideMenu";
import type { RootState } from "../app/store";
import haAthleteImage from "../assets/images/ha_athlete.png";

function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.authentication.user);

  const handleOpenSideMenu = () => {
    setSideMenuOpen(true);
  };

  const handleCloseSideMenu = () => {
    setSideMenuOpen(false);
  };

  const handleOpenNavMenu = () => {
    setNavMenuOpen(true);
  };

  const handleCloseNavMenu = () => {
    setNavMenuOpen(false);
  };

  const navigationLinks = [
    { label: "Home", href: "#" },
    { label: "Athletes", href: "#" },
    { label: "Rankings", href: "#" },
    { label: "Records", href: "#" },
    { label: "Games", href: "#" },
  ];

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
            <Typography
              component="h4"
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                color: "#555b61",
                margin: 0,
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "3.75rem" },
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Box component="span" sx={{ color: "primary.main" }}>
                H
              </Box>
              ighland{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                A
              </Box>
              thlete
            </Typography>
            <Box
              component="img"
              src={haAthleteImage}
              alt="Highland Athlete"
              sx={{
                height: { xs: "2.25rem", md: "4.5rem" },
                width: "auto",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, mr: 6 }}>
              <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500, "&:hover": { color: "primary.main" } }}>
                Home
              </Link>
              <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500, "&:hover": { color: "primary.main" } }}>
                Athletes
              </Link>
              <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500, "&:hover": { color: "primary.main" } }}>
                Rankings
              </Link>
              <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500, "&:hover": { color: "primary.main" } }}>
                Records
              </Link>
              <Link href="#" color="text.primary" underline="none" sx={{ fontWeight: 500, "&:hover": { color: "primary.main" } }}>
                Games
              </Link>
            </Box>
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              onClick={handleOpenNavMenu}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {user && (
              <Button startIcon={<AccountCircle />} sx={{ display: { xs: "none", sm: "flex" } }} onClick={handleOpenSideMenu}>
                {user.lastName && user.firstName ? `${user.lastName}, ${user.firstName}` : user.firstName || user.lastName || user.email || "My Profile"}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={navMenuOpen}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Navigation
          </Typography>
          <IconButton onClick={handleCloseNavMenu} aria-label="close navigation menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navigationLinks.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton component={Link} href={link.href} onClick={handleCloseNavMenu}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
          {user && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleCloseNavMenu();
                    handleOpenSideMenu();
                  }}
                >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.lastName && user.firstName ? `${user.lastName}, ${user.firstName}` : user.firstName || user.lastName || user.email || "My Profile"}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      <SideMenu open={sideMenuOpen} onClose={handleCloseSideMenu} />
    </>
  );
}

export default Header;
