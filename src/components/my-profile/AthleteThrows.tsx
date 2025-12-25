import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Sports, Add, Close as CloseIcon, Videocam, Edit, Delete, Save } from "@mui/icons-material";
import type { AthleteThrow } from "../../models/athlete-throw";
import type { RootState } from "../../app/store";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

interface AthleteThrowsProps {
  athleteThrows: AthleteThrow[];
  onThrowAdded?: () => void;
  currentClassTypeId?: number | null;
}

function AthleteThrows({ athleteThrows, onThrowAdded, currentClassTypeId }: AthleteThrowsProps) {
  const throwTypes = useSelector((state: RootState) => state.shared.throwTypes);
  const classTypes = useSelector((state: RootState) => state.shared.classTypes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingThrow, setEditingThrow] = useState<AthleteThrow | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [throwToDelete, setThrowToDelete] = useState<AthleteThrow | null>(null);
  const [formData, setFormData] = useState({
    throwTypeId: "",
    classTypeId: "",
    feet: "",
    inches: "",
    weight: "", // Added weight to formData
    score: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // Helper function to convert feet and inches to decimal distance (in feet)
  const convertToDistance = (feet: number, inches: number): number => {
    return feet + inches / 12;
  };

  // Helper function to convert decimal distance (in feet) to feet and inches
  const convertFromDistance = (distance: number): { feet: number; inches: number } => {
    const feet = Math.floor(distance);
    const inches = Math.round((distance - feet) * 12);
    return { feet, inches };
  };

  // Filter throws by PR (only show PRs)

  // Group PR throws by class type
  const prThrowsByClassType: { [classTypeId: number]: AthleteThrow[] } = {};
  athleteThrows
    .filter((throwItem) => throwItem.isPr)
    .forEach((throwItem) => {
      if (!prThrowsByClassType[throwItem.classTypeId]) {
        prThrowsByClassType[throwItem.classTypeId] = [];
      }
      prThrowsByClassType[throwItem.classTypeId].push(throwItem);
    });

  // Helper function to get throw type name by ID
  const getThrowTypeName = (throwTypeId: number): string => {
    const throwType = throwTypes.find((type) => type.id === throwTypeId);
    return throwType?.name || `Throw Type ${throwTypeId}`;
  };

  // Helper function to get class type name by ID
  const getClassTypeName = (classTypeId: number): string => {
    const classType = classTypes.find((type) => type.id === classTypeId);
    return classType?.name || `Class Type ${classTypeId}`;
  };

  const handleOpenModal = (throwItem?: AthleteThrow) => {
    if (throwItem) {
      setEditingThrow(throwItem);
      const { feet, inches } = convertFromDistance(throwItem.distance);
      setFormData({
        throwTypeId: String(throwItem.throwTypeId),
        classTypeId: String(throwItem.classTypeId),
        feet: String(feet),
        inches: String(inches),
        weight: throwItem.weight ? String(throwItem.weight) : "",
        score: throwItem.score || "",
        videoUrl: throwItem.videoUrl || "",
      });
    } else {
      setEditingThrow(null);
      // Default to user's current class type if available, otherwise first class type
      const defaultClassTypeId =
        currentClassTypeId && classTypes.find((ct) => ct.id === currentClassTypeId) ? currentClassTypeId : classTypes.length > 0 ? classTypes[0].id : null;
      setFormData({
        throwTypeId: "",
        classTypeId: defaultClassTypeId ? String(defaultClassTypeId) : "",
        feet: "",
        inches: "",
        weight: "",
        score: "",
        videoUrl: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingThrow(null);
    setFormData({ throwTypeId: "", classTypeId: "", feet: "", inches: "", weight: "", score: "", videoUrl: "" });
  };

  const handleEdit = (throwItem: AthleteThrow) => {
    handleOpenModal(throwItem);
  };

  const handleDeleteClick = (throwItem: AthleteThrow) => {
    setThrowToDelete(throwItem);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!throwToDelete) return;

    setDeleteConfirmOpen(false);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";
      const throwId = throwToDelete.id;
      if (!throwId) {
        toast.error("Unable to delete: Throw ID not found");
        setThrowToDelete(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/athlete-throws/${throwId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to delete throw");
        setThrowToDelete(null);
        return;
      }

      toast.success("Throw deleted successfully!");
      setThrowToDelete(null);
      if (onThrowAdded) {
        onThrowAdded();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete throw");
      setThrowToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setThrowToDelete(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: { target: { name?: string; value: unknown } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: String(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.throwTypeId) {
      toast.error("Please select a throw type");
      return;
    }

    if (!formData.classTypeId) {
      toast.error("Please select a class type");
      return;
    }

    // Validate feet and inches
    const feet = Number(formData.feet);
    const inches = Number(formData.inches);

    if (isNaN(feet) || feet < 0 || !Number.isInteger(feet)) {
      toast.error("Please enter a valid number of feet (whole number)");
      return;
    }

    if (isNaN(inches) || inches < 0 || inches > 11.5) {
      toast.error("Please enter a valid number of inches (0-11.5)");
      return;
    }

    if (feet === 0 && inches === 0) {
      toast.error("Please enter a distance greater than 0");
      return;
    }

    // Convert feet and inches to decimal distance
    const distance = convertToDistance(feet, inches);

    const selectedThrowTypeId = Number(formData.throwTypeId);
    const selectedClassTypeId = Number(formData.classTypeId);
    const selectedThrowType = throwTypes.find((type) => type.id === selectedThrowTypeId);

    // Check for existing throw for this class type (only allow 1 throw type per class type)
    if (!editingThrow) {
      const existingThrowForClass = athleteThrows.find((throwItem) => throwItem.classTypeId === selectedClassTypeId &&
      throwItem.throwTypeId === selectedThrowTypeId &&  
      throwItem.isPr);
      if (existingThrowForClass) {
        const classTypeName = getClassTypeName(selectedClassTypeId);
        const existingThrowTypeName = getThrowTypeName(existingThrowForClass.throwTypeId);
        toast.error(`You already have a ${existingThrowTypeName} PR for ${classTypeName}. Only one throw type per class type is allowed.`);
        return;
      }
    } else {
      // When editing, check if there's another throw for this class type (excluding the current throw being edited by ID)
      const existingThrowForClass = athleteThrows.find(
        (throwItem) =>
          throwItem.id !== editingThrow.id && 
        throwItem.throwTypeId === selectedThrowTypeId && 
        throwItem.classTypeId === selectedClassTypeId && throwItem.isPr
      );
      if (existingThrowForClass) {
        const classTypeName = getClassTypeName(selectedClassTypeId);
        const existingThrowTypeName = getThrowTypeName(existingThrowForClass.throwTypeId);
        toast.error(`You already have a ${existingThrowTypeName} PR for ${classTypeName}. Only one throw type per class type is allowed.`);
        return;
      }
    }

    // Validate distance against maxDistance
    if (selectedThrowType && distance > selectedThrowType.maxDistance) {
      const maxFeet = Math.floor(selectedThrowType.maxDistance);
      const maxInches = Math.round((selectedThrowType.maxDistance - maxFeet) * 12);
      toast.error(`Distance cannot exceed ${maxFeet}' ${maxInches}" for ${selectedThrowType.name}`);
      return;
    }

    // Validate score for Caber (clock-like time format)
    const isCaber = selectedThrowType?.name.toLowerCase() === "caber";
    if (isCaber && formData.score) {
      // Pattern: number (1-2 digits) optionally followed by : and two digits
      // Examples: 12, 11:45, 11:30, 10:45, 10, 10:00, 9:45
      const scorePattern = /^(\d{1,2}(:\d{2})?)$/;
      if (!scorePattern.test(formData.score.trim())) {
        toast.error("Score must be in clock-like format (e.g., 12, 11:45, 10:00)");
        return;
      }
    }

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";
      const url = editingThrow ? `${API_BASE_URL}/api/athlete-throws/${editingThrow.id}` : `${API_BASE_URL}/api/athlete-throws`;
      const method = editingThrow ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          throwTypeId: Number(formData.throwTypeId),
          classTypeId: Number(formData.classTypeId),
          distance: distance,
          weight: formData.weight ? Number(formData.weight) : null,
          score: formData.score || null,
          videoUrl: formData.videoUrl || null,
          isPr: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || (editingThrow ? "Failed to update throw" : "Failed to add throw"));
        setLoading(false);
        return;
      }

      // Success - close modal and refresh
      toast.success(`${editingThrow ? "Throw updated" : "PR throw added"} successfully!`);
      handleCloseModal();
      if (onThrowAdded) {
        onThrowAdded();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : editingThrow ? "Failed to update throw" : "Failed to add throw");
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 500 },
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    maxHeight: "90vh",
    overflow: "auto",
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Sports className="primary-blue" /> Athlete PR Throws
        </Typography>

        {/* PRs grouped by Class Type */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 }}>
            <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => handleOpenModal()}>
              Add New
            </Button>
          </Box>
          {Object.keys(prThrowsByClassType).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No PRs recorded yet.
            </Typography>
          ) : (
            <Box>
              {Object.entries(prThrowsByClassType)
                .sort(([aId], [bId]) => {
                  const aName = getClassTypeName(Number(aId)).toLowerCase();
                  const bName = getClassTypeName(Number(bId)).toLowerCase();
                  return aName.localeCompare(bName);
                })
                .map(([classTypeId, throws]) => {
                  const sortedThrows = [...throws].sort((a, b) => {
                    const aName = getThrowTypeName(a.throwTypeId).toLowerCase();
                    const bName = getThrowTypeName(b.throwTypeId).toLowerCase();
                    return aName.localeCompare(bName);
                  });
                  return (
                    <Box key={classTypeId} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        {getClassTypeName(Number(classTypeId))}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {sortedThrows.map((athleteThrow) => (
                          <Box
                            key={athleteThrow.id}
                            sx={{
                              mb: 2,
                              p: 2,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                              position: "relative",
                              width: 300,
                              minWidth: 0,
                              boxSizing: "border-box",
                              flex: "0 1 300px",
                            }}
                          >
                            <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
                              <IconButton size="small" onClick={() => handleEdit(athleteThrow)} aria-label="Edit throw">
                                <Edit fontSize="small" className="primary-blue" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteClick(athleteThrow)} aria-label="Delete throw">
                                <Delete color="error" fontSize="small" />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              {getThrowTypeName(athleteThrow.throwTypeId)}
                            </Typography>
                            {(() => {
                              const throwTypeName = getThrowTypeName(athleteThrow.throwTypeId);
                              const isCaber = throwTypeName.toLowerCase() === "caber";
                              const { feet, inches } = convertFromDistance(athleteThrow.distance);

                              if (isCaber) {
                                return (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                                    <Typography variant="body1">
                                      Length:{" "}
                                      <Box component="span" sx={{ fontWeight: 600 }}>
                                        {feet}' {inches}"
                                      </Box>
                                      {athleteThrow.weight && (
                                        <>
                                          {" "}
                                          <Box component="span" sx={{ fontWeight: 600 }}>
                                            {athleteThrow.weight} lbs
                                          </Box>
                                        </>
                                      )}
                                    </Typography>
                                    {athleteThrow.score && (
                                      <Typography variant="body1">
                                        Score:{" "}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                          {athleteThrow.score}
                                        </Box>
                                      </Typography>
                                    )}
                                    {athleteThrow.videoUrl && (
                                      <IconButton component="a" href={athleteThrow.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                                        <Videocam className="primary-blue" />
                                      </IconButton>
                                    )}
                                  </Box>
                                );
                              }

                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body1">
                                    Distance:{" "}
                                    <Box component="span" sx={{ fontWeight: 600 }}>
                                      {feet}' {inches}"
                                    </Box>
                                  </Typography>
                                  {athleteThrow.videoUrl && (
                                    <IconButton component="a" href={athleteThrow.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                                      <Videocam className="primary-blue" />
                                    </IconButton>
                                  )}
                                </Box>
                              );
                            })()}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Add Throw Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" component="h2">
              {editingThrow ? "Edit" : "Add"} PR Throw
            </Typography>
            <IconButton onClick={handleCloseModal} aria-label="close">
              <CloseIcon className="primary-blue" />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Class Type</InputLabel>
              <Select name="classTypeId" value={formData.classTypeId} onChange={handleSelectChange} label="Class Type" disabled={!!editingThrow}>
                {classTypes.map((classType) => (
                  <MenuItem key={classType.id} value={String(classType.id)}>
                    {classType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Throw Type</InputLabel>
              <Select name="throwTypeId" value={formData.throwTypeId} onChange={handleSelectChange} label="Throw Type">
                {throwTypes.map((throwType) => (
                  <MenuItem key={throwType.id} value={String(throwType.id)}>
                    {throwType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Feet"
                name="feet"
                type="number"
                value={formData.feet}
                onChange={handleChange}
                required
                inputProps={{
                  min: 0,
                  step: 1,
                }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Inches"
                name="inches"
                type="number"
                value={formData.inches}
                onChange={handleChange}
                required
                inputProps={{
                  min: 0,
                  max: 11.5,
                  step: 0.5,
                }}
                error={
                  formData.throwTypeId && formData.feet && formData.inches
                    ? (() => {
                        const feet = Number(formData.feet);
                        const inches = Number(formData.inches);
                        const distance = convertToDistance(feet, inches);
                        const maxDistance = throwTypes.find((t) => t.id === Number(formData.throwTypeId))?.maxDistance || 0;
                        return distance > maxDistance;
                      })()
                    : false
                }
                sx={{ flex: 1 }}
              />
            </Box>

            {/* Weight and Score fields for Caber */}
            {formData.throwTypeId &&
              (() => {
                const selectedThrowType = throwTypes.find((t) => t.id === Number(formData.throwTypeId));
                const isCaber = selectedThrowType?.name.toLowerCase() === "caber";
                if (isCaber) {
                  return (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        label="Weight in lbs"
                        name="weight"
                        type="number"
                        value={formData.weight}
                        onChange={handleChange}
                        inputProps={{
                          min: 0,
                          step: 0.01,
                        }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Score"
                        name="score"
                        type="text"
                        value={formData.score}
                        onChange={handleChange}
                        helperText="Clock-like format (e.g., 12, 11:45, 10:00)"
                        inputProps={{
                          pattern: "^\\d{1,2}(:\\d{2})?$",
                        }}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  );
                }
                return null;
              })()}

            <TextField
              label="Video URL (optional)"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              fullWidth
              placeholder="https://youtube.com/watch?v=..."
              helperText="Link to a video of this throw"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseModal} fullWidth disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : editingThrow ? <Save /> : <Add />}
              >
                {loading ? (editingThrow ? "Updating..." : "Adding...") : editingThrow ? "Update Throw" : "Add Throw"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Throw"
        message="Are you sure you want to delete this throw? This action cannot be undone."
      />
    </Card>
  );
}

export default AthleteThrows;
