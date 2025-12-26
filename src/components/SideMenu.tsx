import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Drawer, Box, Typography, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Close as CloseIcon, AccountCircle, Settings, Logout, People } from "@mui/icons-material";
import { logoutUser } from "../slices/authenticationSlice";
import type { AppDispatch, RootState } from "../app/store";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

function SideMenu({ open, onClose }: SideMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.authentication.user);
  const drawerWidth = 320;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    onClose();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/my-profile');
    onClose();
  };

  const handleManageUsersClick = () => {
    navigate('/manage-users');
    onClose();
  };

  const displayName = user?.lastName && user?.firstName
    ? `${user.lastName}, ${user.firstName}`
    : user?.firstName || user?.lastName || user?.email || "My Profile";

  // Check if user has "Manage Users" permission based on permission slug
  // The role object is included in the API response but not in the User type definition
  const hasManageUsersPermission = user && 
    (user as any).role?.permissions && 
    Array.isArray((user as any).role.permissions) && 
    (user as any).role.permissions.some((permission: any) => permission.slug === "manage-users");

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {displayName}
        </Typography>
        <IconButton onClick={onClose} aria-label="close drawer">
          <CloseIcon className="primary-blue" />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountCircle className="primary-blue" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Settings className="primary-blue" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          {hasManageUsersPermission && (
            <ListItem disablePadding>
              <ListItemButton onClick={handleManageUsersClick}>
                <ListItemIcon>
                  <People className="primary-blue" />
                </ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItemButton>
            </ListItem>
          )}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout className="primary-blue" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default SideMenu;

