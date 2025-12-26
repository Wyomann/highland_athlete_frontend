import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Email, Person, Facebook, Instagram, Edit, Save, Cancel, Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { updateUser } from "../../slices/authenticationSlice";
import type { AppDispatch, RootState } from "../../app/store";
import type { User } from "../../models/user";

// Helper functions
const inchesToFeetAndInches = (inches: number | null): { feet: number; inches: number } => {
  if (!inches) return { feet: 0, inches: 0 };
  return {
    feet: Math.floor(inches / 12),
    inches: inches % 12,
  };
};

const feetAndInchesToInches = (feet: number, inches: number): number => {
  return feet * 12 + inches;
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

interface PersonalInformationProps {
  user: User;
}

function PersonalInformation({ user }: PersonalInformationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.authentication);
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);
  const states = useSelector((state: RootState) => state.shared.states);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    facebookUrl: "",
    instagramUrl: "",
    password: "",
    confirmPassword: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    dateOfBirth: "",
    currentClassTypeId: "",
    state: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    heightFeet?: string;
    heightInches?: string;
    weight?: string;
    dateOfBirth?: string;
  }>({});

  // Initialize form data from user
  useEffect(() => {
    const height = inchesToFeetAndInches(user.height);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      facebookUrl: user.facebookUrl || "",
      instagramUrl: user.instagramUrl || "",
      password: "",
      confirmPassword: "",
      heightFeet: height.feet > 0 ? height.feet.toString() : "",
      heightInches: height.inches > 0 ? height.inches.toString() : "",
      weight: user.weight ? user.weight.toString() : "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      currentClassTypeId: user.currentClassTypeId ? user.currentClassTypeId.toString() : "",
      state: user.state || "",
    });
  }, [user]);

  // Reset form when canceling edit
  const handleCancel = () => {
    const height = inchesToFeetAndInches(user.height);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      facebookUrl: user.facebookUrl || "",
      instagramUrl: user.instagramUrl || "",
      password: "",
      confirmPassword: "",
      heightFeet: height.feet > 0 ? height.feet.toString() : "",
      heightInches: height.inches > 0 ? height.inches.toString() : "",
      weight: user.weight ? user.weight.toString() : "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      currentClassTypeId: user.currentClassTypeId ? user.currentClassTypeId.toString() : "",
      state: user.state || "",
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numeric input for numeric fields
    if (["heightFeet", "heightInches", "weight"].includes(name)) {
      if (value !== "" && !/^\d+$/.test(value)) {
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof validationErrors];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: { target: { name?: string; value: unknown } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: String(value) }));
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (formData.confirmPassword) {
      errors.confirmPassword = "Please enter a password";
    }

    // Height validation
    if (formData.heightFeet || formData.heightInches) {
      const feet = parseInt(formData.heightFeet) || 0;
      const inches = parseInt(formData.heightInches) || 0;
      if (feet < 0 || feet > 10) {
        errors.heightFeet = "Feet must be between 0 and 10";
      }
      if (inches < 0 || inches >= 12) {
        errors.heightInches = "Inches must be between 0 and 11";
      }
    }

    // Weight validation
    if (formData.weight) {
      const weight = parseInt(formData.weight);
      if (isNaN(weight) || weight < 0 || weight > 1000) {
        errors.weight = "Weight must be between 0 and 1000 lbs";
      }
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      } else if (birthDate.getFullYear() < 1900) {
        errors.dateOfBirth = "Date of birth must be after 1900";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updateData: {
      firstName?: string | null;
      lastName?: string | null;
      facebookUrl?: string | null;
      instagramUrl?: string | null;
      password?: string;
      height?: number | null;
      weight?: number | null;
      dateOfBirth?: string | null;
      currentClassTypeId?: number | null;
      state?: string | null;
    } = {
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      facebookUrl: formData.facebookUrl || null,
      instagramUrl: formData.instagramUrl || null,
    };

    // Only include password if it was provided
    if (formData.password) {
      updateData.password = formData.password;
    }

    // Calculate height in inches
    if (formData.heightFeet || formData.heightInches) {
      const feet = parseInt(formData.heightFeet) || 0;
      const inches = parseInt(formData.heightInches) || 0;
      updateData.height = feetAndInchesToInches(feet, inches);
    } else {
      updateData.height = null;
    }

    // Weight
    if (formData.weight) {
      updateData.weight = parseInt(formData.weight);
    } else {
      updateData.weight = null;
    }

    // Date of birth
    if (formData.dateOfBirth) {
      updateData.dateOfBirth = formData.dateOfBirth;
    } else {
      updateData.dateOfBirth = null;
    }

    // Current class type ID
    if (formData.currentClassTypeId) {
      updateData.currentClassTypeId = parseInt(formData.currentClassTypeId);
    } else {
      updateData.currentClassTypeId = null;
    }

    // State
    if (formData.state) {
      updateData.state = formData.state;
    } else {
      updateData.state = null;
    }

    const result = await dispatch(updateUser(updateData));

    if (updateUser.fulfilled.match(result)) {
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setValidationErrors({});
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person className="primary-blue" /> Personal Information
          </Typography>
          {!isEditing ? (
            <Button startIcon={<Edit />} variant="outlined" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button startIcon={<Cancel />} variant="outlined" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button startIcon={loading ? <CircularProgress size={20} /> : <Save />} variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </Box>
          )}
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            autoComplete="given-name"
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            autoComplete="family-name"
          />

          <TextField
            label="Email"
            name="email"
            value={user.email}
            disabled
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email className="primary-blue" />
                </InputAdornment>
              ),
            }}
            helperText="Email cannot be changed"
          />

          {/* Current Class Type */}
          <FormControl fullWidth disabled={!isEditing}>
            <InputLabel>Current Class</InputLabel>
            <Select
              name="currentClassTypeId"
              value={isEditing ? formData.currentClassTypeId : user.currentClassTypeId ? user.currentClassTypeId.toString() : ""}
              onChange={handleSelectChange}
              label="Current Class"
              renderValue={(value) => {
                if (!value || value === "") return "None";
                const selectedId = parseInt(value as string);
                const classType = classTypes.find((ct, index) => {
                  const classTypeId = (ct as any).id || index + 1;
                  return classTypeId === selectedId;
                });
                return classType ? classType.name : "None";
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {classTypes.map((classType, index) => {
                // Class types may have an id field or use index-based IDs
                const classTypeId = (classType as any).id || index + 1;
                return (
                  <MenuItem key={classTypeId} value={classTypeId.toString()}>
                    {classType.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* State */}
          <FormControl fullWidth disabled={!isEditing}>
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={isEditing ? formData.state : user.state || ""}
              onChange={handleSelectChange}
              label="State"
              renderValue={(value) => {
                if (!value || value === "") return "None";
                const selectedState = states.find((s) => s.abbreviation === value);
                return selectedState ? `${selectedState.abbreviation} - ${selectedState.name}` : value;
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.abbreviation} value={state.abbreviation}>
                  {state.abbreviation} - {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Facebook Profile"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            placeholder="https://facebook.com/yourprofile"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {!isEditing && formData.facebookUrl ? (
                    <IconButton
                      component="a"
                      href={formData.facebookUrl}
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
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            placeholder="https://instagram.com/yourprofile"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {!isEditing && formData.instagramUrl ? (
                    <IconButton
                      component="a"
                      href={formData.instagramUrl}
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

          {/* Height, Weight, Age - Display side by side in view mode */}
          {!isEditing ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Height"
                value={user.height ? `${inchesToFeetAndInches(user.height).feet}'${inchesToFeetAndInches(user.height).inches}"` : ""}
                disabled
                sx={{ flex: 1 }}
              />
              <TextField label="Weight" value={user.weight ? `${user.weight} lbs` : ""} disabled sx={{ flex: 1 }} />
              <TextField
                label="Age"
                value={calculateAge(user.dateOfBirth) !== null ? `${calculateAge(user.dateOfBirth)} years old` : ""}
                disabled
                sx={{ flex: 1 }}
              />
            </Box>
          ) : (
            <>
              {/* Height */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Height (Feet)"
                  name="heightFeet"
                  type="number"
                  value={formData.heightFeet}
                  onChange={handleChange}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, max: 10 }}
                  error={!!validationErrors.heightFeet}
                  helperText={validationErrors.heightFeet}
                />
                <TextField
                  label="Height (Inches)"
                  name="heightInches"
                  type="number"
                  value={formData.heightInches}
                  onChange={handleChange}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, max: 11 }}
                  error={!!validationErrors.heightInches}
                  helperText={validationErrors.heightInches}
                />
              </Box>

              {/* Weight */}
              <TextField
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 1000 }}
                error={!!validationErrors.weight}
                helperText={validationErrors.weight}
              />

              {/* Date of Birth */}
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                error={!!validationErrors.dateOfBirth}
                helperText={validationErrors.dateOfBirth || "Age will be calculated from your date of birth"}
              />
            </>
          )}

          {isEditing && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Lock fontSize="small" className="primary-blue" /> Change Password (optional)
                </Typography>
                <TextField
                  label="New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                  fullWidth
                  autoComplete="new-password"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff className="primary-blue" /> : <Visibility className="primary-blue" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!validationErrors.confirmPassword}
                  helperText={validationErrors.confirmPassword}
                  fullWidth
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle confirm password visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff className="primary-blue" /> : <Visibility className="primary-blue" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default PersonalInformation;
