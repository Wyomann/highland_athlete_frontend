import { useState } from "react";
import { useSelector } from "react-redux";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import SideMenu from "./SideMenu";
import type { RootState } from "../app/store";

function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.authentication.user);

  const handleOpenSideMenu = () => {
    setSideMenuOpen(true);
  };

  const handleCloseSideMenu = () => {
    setSideMenuOpen(false);
  };

  return (
    <>
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
            {user && (
              <Button 
                startIcon={<AccountCircle />} 
                sx={{ display: { xs: "none", sm: "flex" } }}
                onClick={handleOpenSideMenu}
              >
                {user.lastName && user.firstName
                  ? `${user.lastName}, ${user.firstName}`
                  : user.firstName || user.lastName || user.email || "My Profile"}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <SideMenu open={sideMenuOpen} onClose={handleCloseSideMenu} />
    </>
  );
}

export default Header;

