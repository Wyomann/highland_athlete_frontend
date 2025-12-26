import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import type { RootState } from "../app/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRoleSlug?: string;
}

function ProtectedRoute({ children, requiredPermission, requiredRoleSlug }: ProtectedRouteProps) {
  const user = useSelector((state: RootState) => state.authentication.user);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      let authorized = false;

      // Check for required permission slug
      // The role object is included in the API response but not in the User type definition
      if (requiredPermission) {
        authorized = 
          (user as any).role?.permissions && 
          Array.isArray((user as any).role.permissions) && 
          (user as any).role.permissions.some((permission: any) => permission.slug === requiredPermission);
      }
      // Check for required role slug (fallback for backward compatibility)
      else if (requiredRoleSlug) {
        authorized = (user as any).role?.slug === requiredRoleSlug;
      }
      // If no requirement specified, allow access for logged-in users
      else {
        authorized = true;
      }

      setIsAuthorized(authorized);
      setIsLoading(false);
    };

    checkAuthorization();
  }, [user, requiredPermission, requiredRoleSlug]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isAuthorized === false) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", p: 3 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;

