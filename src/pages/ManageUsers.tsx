import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from "@mui/x-data-grid";
import { People, Search, Edit } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../app/store";
import { fetchAllUsers, updateUser } from "../slices/manageUsersSlice";
import type { User } from "../models/user";
import { toast } from "react-toastify";

function ManageUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.manageUsers);
  const { roles } = useSelector((state: RootState) => state.shared);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialFetchRef = useRef(false);
  const previousSearchTermRef = useRef<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    roleId: "",
    accountLockedUntil: "",
  });

  // Initial fetch on component mount - only if users array is empty
  useEffect(() => {
    // Only fetch if we haven't fetched yet AND users array is empty
    // This prevents duplicate calls from StrictMode remounts
    if (!hasInitialFetchRef.current && users.length === 0 && !loading) {
      hasInitialFetchRef.current = true;
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users.length, loading]);

  // Handle search with debouncing
  useEffect(() => {
    // Skip on initial mount when searchTerm is empty (initial fetch handles that)
    if (!hasInitialFetchRef.current) {
      previousSearchTermRef.current = searchTerm;
      return;
    }

    // If searchTerm hasn't changed, skip
    if (previousSearchTermRef.current === searchTerm) {
      return;
    }

    previousSearchTermRef.current = searchTerm;

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(fetchAllUsers(searchTerm || undefined));
    }, 500); // 500ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [dispatch, searchTerm]);

  // Helper function to get role name
  const getRoleName = (user: User): string => {
    // Check if the user object includes role information from the API
    if ((user as any).role) {
      return (user as any).role.name || "N/A";
    }
    // Fallback if role object is not included
    return user.roleId ? `Role ${user.roleId}` : "No Role";
  };

  // Format date helper
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Handle edit button click
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    // Check both user.roleId and nested role object (API might return role nested)
    const currentRoleId = user.roleId ?? (user as any).role?.id ?? null;
    setFormData({
      roleId: currentRoleId ? currentRoleId.toString() : "",
      accountLockedUntil: user.accountLockedUntil ? user.accountLockedUntil.split("T")[0] : "",
    });
    setEditModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setFormData({
      roleId: "",
      accountLockedUntil: "",
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedUser) return;

    const updateData: { roleId?: number | null; accountLockedUntil?: string | null } = {};

    if (formData.roleId) {
      updateData.roleId = parseInt(formData.roleId);
    } else {
      updateData.roleId = null;
    }

    if (formData.accountLockedUntil) {
      // Convert date string (YYYY-MM-DD) to format "YYYY-MM-DDTHH:mm:ssZ"
      // Parse the date and set to end of day (23:59:59) in UTC
      const dateParts = formData.accountLockedUntil.split("-");
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(dateParts[2], 10);

        // Create date (ignore time, just use YYYY-MM-DD)
        const date = new Date(Date.UTC(year, month, day));
        // Format as "YYYY-MM-DD"
        updateData.accountLockedUntil = date.toISOString().split("T")[0];
      } else {
        toast.error("Invalid date format");
        return;
      }
    } else {
      updateData.accountLockedUntil = null;
    }
    const result = await dispatch(updateUser({ userId: selectedUser.id, userData: updateData }));

    if (updateUser.fulfilled.match(result)) {
      toast.success("User updated successfully!");
      handleCloseModal();
      // Refresh the users list
      dispatch(fetchAllUsers(searchTerm || undefined));
    } else {
      toast.error((result.payload as string) || "Failed to update user");
    }
  };

  // Prepare data for DataGrid
  const rows = users.map((user) => ({
    id: user.id,
    firstName: user.firstName || "N/A",
    lastName: user.lastName || "N/A",
    email: user.email,
    role: getRoleName(user),
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
    userData: user, // Store full user object for edit
    accountLockedUntil: formatDate(user.accountLockedUntil),
  }));

  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name", flex: 1, minWidth: 150 },
    { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "role", headerName: "Role", flex: 1, minWidth: 150 },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 150 },
    { field: "updatedAt", headerName: "Updated At", flex: 1, minWidth: 150 },
    { field: "accountLockedUntil", headerName: "Account Locked Until", flex: 1, minWidth: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const user = params.row.userData as User;
        return (
          <IconButton onClick={() => handleEditClick(user)} size="small" aria-label="Edit user" className="primary-blue">
            <Edit />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, flexShrink: 0 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <People className="primary-blue" />
          Manage Users
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          View and manage all users in the system
        </Typography>

        {/* Search */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            label="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </Box>

      {/* Users DataGrid */}
      <Box
        sx={{
          flex: { xs: "0 1 auto", sm: 1 },
          overflow: { xs: "visible", sm: "visible" },
          px: 3,
          pb: 3,
          "& *::-webkit-scrollbar": {
            display: "none",
          },
          "& *": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error Loading Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[25, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pagination
              disableRowSelectionOnClick
              sx={{
                height: "auto",
                border: 0,
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "background.paper",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                  display: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "& .MuiDataGrid-main::-webkit-scrollbar": {
                  display: "none",
                },
                "& .MuiDataGrid-main": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "& .MuiDataGrid-root::-webkit-scrollbar": {
                  display: "none",
                },
                "& .MuiDataGrid-root": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              slots={{
                noRowsOverlay: () => (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found.
                    </Typography>
                  </Box>
                ),
              }}
            />
          </Paper>
        )}
      </Box>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {selectedUser.email}
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={formData.roleId} label="Role" onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Account Locked Until"
                type="date"
                value={formData.accountLockedUntil}
                onChange={(e) => setFormData({ ...formData, accountLockedUntil: e.target.value })}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Leave empty to unlock the account"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageUsers;
