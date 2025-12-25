import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Person, Facebook, Instagram } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { User } from "../../models/user";
import type { RootState } from "../../app/store";

interface AthletePersonalInformationProps {
  user: User;
}

// Helper functions
const inchesToFeetAndInches = (inches: number | null): { feet: number; inches: number } => {
  if (!inches) return { feet: 0, inches: 0 };
  return {
    feet: Math.floor(inches / 12),
    inches: inches % 12,
  };
};

const calculateAge = (dateOfBirth: string | null): number | null => {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Read-only Personal Information component for viewing athlete profiles
 */
function AthletePersonalInformation({ user }: AthletePersonalInformationProps) {
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);

  // Get class type name
  const getClassTypeName = (classTypeId: number | null): string => {
    if (!classTypeId) return "None";
    const classType = classTypes.find((ct) => ct.id === classTypeId);
    return classType?.name || `Class ${classTypeId}`;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Person className="primary-blue" /> Personal Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField label="First Name" value={user.firstName || ""} disabled fullWidth autoComplete="given-name" />

          <TextField label="Last Name" value={user.lastName || ""} disabled fullWidth autoComplete="family-name" />

          {/* Current Class Type */}
          <FormControl fullWidth disabled>
            <InputLabel>Current Class</InputLabel>
            <Select
              value={user.currentClassTypeId ? user.currentClassTypeId.toString() : ""}
              label="Current Class"
              renderValue={() => getClassTypeName(user.currentClassTypeId)}
            >
              <MenuItem value={user.currentClassTypeId ? user.currentClassTypeId.toString() : ""}>
                {getClassTypeName(user.currentClassTypeId)}
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Facebook Profile"
            value={user.facebookUrl || ""}
            disabled
            fullWidth
            placeholder="No Facebook Profile"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {user.facebookUrl ? (
                    <IconButton
                      component="a"
                      href={user.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      aria-label="Open Facebook profile"
                    >
                      <Facebook className="primary-blue" />
                    </IconButton>
                  ) : (
                    <Facebook className="primary-blue" />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Instagram Profile"
            value={user.instagramUrl || ""}
            disabled
            fullWidth
            placeholder="No Instagram Profile"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {user.instagramUrl ? (
                    <IconButton
                      component="a"
                      href={user.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      aria-label="Open Instagram profile"
                      sx={{ color: "#E4405F" }}
                    >
                      <Instagram />
                    </IconButton>
                  ) : (
                    <Instagram sx={{ color: "#E4405F" }} />
                  )}
                </InputAdornment>
              ),
            }}
          />

          {/* Height, Weight, Age - Display side by side */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Height"
              value={user.height ? `${inchesToFeetAndInches(user.height).feet}'${inchesToFeetAndInches(user.height).inches}"` : ""}
              disabled
              sx={{ flex: 1 }}
            />
            <TextField label="Weight" value={user.weight ? `${Math.floor(user.weight)} lbs` : ""} disabled sx={{ flex: 1 }} />
            <TextField
              label="Age"
              value={calculateAge(user.dateOfBirth) !== null ? `${calculateAge(user.dateOfBirth)} years old` : ""}
              disabled
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AthletePersonalInformation;

