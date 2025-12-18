import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Link,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AccountCircle, Menu as MenuIcon, Close as CloseIcon, ArrowDropDown } from "@mui/icons-material";
import SideMenu from "./SideMenu";
import type { RootState } from "../app/store";
import haAthleteImage from "../assets/images/ha_athlete.png";

const NavLink = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "1.125rem",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

function Header() {
  const navigate = useNavigate();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [rankingsAnchorEl, setRankingsAnchorEl] = useState<null | HTMLElement>(null);
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

  const rankingsMenuOpen = Boolean(rankingsAnchorEl);
  const handleRankingsMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    // Only set anchor if not already set (prevents menu from moving when hovering over it)
    if (!rankingsAnchorEl) {
      setRankingsAnchorEl(event.currentTarget);
    }
  };
  const handleRankingsMouseLeave = () => {
    setRankingsAnchorEl(null);
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Athletes", href: "/athletes" },
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
              <NavLink
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                color="text.primary"
                underline="none"
                sx={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
              >
                Home
              </NavLink>
              <NavLink
                href="/athletes"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/athletes');
                }}
                color="text.primary"
                underline="none"
                sx={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                Athletes
              </NavLink>
              <Box
                sx={{ display: "flex", alignItems: "center" }}
                onMouseEnter={handleRankingsMouseEnter}
                onMouseLeave={handleRankingsMouseLeave}
              >
                <Button
                  endIcon={<ArrowDropDown />}
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: "1.125rem",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                    lineHeight: "inherit",
                    "&:hover": {
                      color: "primary.main",
                      background: "none",
                    },
                  }}
                  aria-controls={rankingsMenuOpen ? "rankings-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={rankingsMenuOpen ? "true" : undefined}
                >
                  Rankings
                </Button>
                <Menu
                  anchorEl={rankingsAnchorEl}
                  id="rankings-menu"
                  open={rankingsMenuOpen}
                  onClose={handleRankingsMouseLeave}
                  MenuListProps={{
                    onMouseLeave: handleRankingsMouseLeave,
                  }}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      onMouseLeave: handleRankingsMouseLeave,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem>
                    <ListItemText primary="Highland Athlete Throw Rankings" />
                  </MenuItem>
                  <MenuItem>
                    <ListItemText primary="IHGF Throw Rankings" />
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      navigate("/rankings/lifts");
                      handleRankingsMouseLeave();
                    }}
                  >
                    <ListItemText primary="Highland Athlete Lift Rankings" />
                  </MenuItem>
                </Menu>
              </Box>
              <NavLink href="#" color="text.primary" underline="none">
                Records
              </NavLink>
              <NavLink href="#" color="text.primary" underline="none">
                Games
              </NavLink>
            </Box>
            <IconButton color="inherit" aria-label="open navigation menu" onClick={handleOpenNavMenu} sx={{ display: { xs: "flex", md: "none" } }}>
              <MenuIcon className="primary-blue" />
            </IconButton>
            {user && (
              <Button
                startIcon={<AccountCircle />}
                sx={{ display: { xs: "none", sm: "flex", fontSize: "1.125rem" } }}
                onClick={handleOpenSideMenu}
              >
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
            <CloseIcon className="primary-blue" />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navigationLinks.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(link.href);
                  handleCloseNavMenu();
                }}
              >
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
                    <AccountCircle className="primary-blue" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      user.lastName && user.firstName ? `${user.lastName}, ${user.firstName}` : user.firstName || user.lastName || user.email || "My Profile"
                    }
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
