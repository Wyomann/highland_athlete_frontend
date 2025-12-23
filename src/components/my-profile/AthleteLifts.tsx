import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
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
import { FitnessCenter, Add, Close as CloseIcon, Videocam, Edit, Delete, Save } from "@mui/icons-material";
import type { AthleteLift } from "../../models/athlete-lift";
import type { RootState } from "../../app/store";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

interface AthleteLiftsProps {
  athleteLifts: AthleteLift[];
  onLiftAdded?: () => void;
}

function AthleteLifts({ athleteLifts, onLiftAdded }: AthleteLiftsProps) {
  const liftTypes = useSelector((state: RootState) => state.shared.liftTypes);
  const [modalOpen, setModalOpen] = useState(false);
  const [prType, setPrType] = useState<"allTime" | "current">("allTime");
  const [editingLift, setEditingLift] = useState<AthleteLift | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [liftToDelete, setLiftToDelete] = useState<AthleteLift | null>(null);
  const [formData, setFormData] = useState({
    liftTypeId: "",
    weight: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // Helper function to get lift type name by ID
  const getLiftTypeName = (liftTypeId: number): string => {
    const liftType = liftTypes.find((_, index) => index + 1 === liftTypeId);
    return liftType?.name || `Lift Type ${liftTypeId}`;
  };

  // Filter lifts by PR type
  const allTimePRs = athleteLifts
    .filter((lift) => lift.isPr)
    .slice()
    .sort((a, b) => {
      const nameA = getLiftTypeName(a.liftTypeId).toLowerCase();
      const nameB = getLiftTypeName(b.liftTypeId).toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const currentPRs = athleteLifts
    .filter((lift) => lift.isCurrentPr)
    .slice()
    .sort((a, b) => {
      const nameA = getLiftTypeName(a.liftTypeId).toLowerCase();
      const nameB = getLiftTypeName(b.liftTypeId).toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const handleOpenModal = (type: "allTime" | "current", lift?: AthleteLift) => {
    setPrType(type);
    if (lift) {
      setEditingLift(lift);
      setFormData({
        liftTypeId: String(lift.liftTypeId),
        weight: String(lift.weight),
        videoUrl: lift.videoUrl || "",
      });
    } else {
      setEditingLift(null);
      setFormData({ liftTypeId: "", weight: "", videoUrl: "" });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLift(null);
    setFormData({ liftTypeId: "", weight: "", videoUrl: "" });
  };

  const handleEdit = (lift: AthleteLift) => {
    const type = lift.isPr ? "allTime" : "current";
    handleOpenModal(type, lift);
  };

  const handleDeleteClick = (lift: AthleteLift) => {
    setLiftToDelete(lift);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!liftToDelete) return;

    setDeleteConfirmOpen(false);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";
      // Use id from the lift object (may not be in TypeScript interface but exists in API response)
      const liftId = (liftToDelete as any).id;
      if (!liftId) {
        toast.error("Unable to delete: Lift ID not found");
        setLiftToDelete(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/athlete-lifts/${liftId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to delete lift");
        setLiftToDelete(null);
        return;
      }

      toast.success("Lift deleted successfully!");
      setLiftToDelete(null);
      if (onLiftAdded) {
        onLiftAdded();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete lift");
      setLiftToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setLiftToDelete(null);
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

    if (!formData.liftTypeId) {
      toast.error("Please select a lift type");
      return;
    }

    if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    const selectedLiftTypeId = Number(formData.liftTypeId);
    const selectedLiftTypeIndex = selectedLiftTypeId - 1;
    const selectedLiftType = liftTypes[selectedLiftTypeIndex];

    // Check for duplicate PRs with the same lift type (skip if editing the same lift)
    if (!editingLift) {
      if (prType === "allTime") {
        const existingAllTimePR = athleteLifts.find((lift) => lift.liftTypeId === selectedLiftTypeId && lift.isPr);
        if (existingAllTimePR) {
          toast.error(`You already have an All Time PR for ${selectedLiftType?.name || "this lift type"}`);
          return;
        }
      } else if (prType === "current") {
        const existingCurrentPR = athleteLifts.find((lift) => lift.liftTypeId === selectedLiftTypeId && lift.isCurrentPr);
        if (existingCurrentPR) {
          toast.error(`You already have a Current PR for ${selectedLiftType?.name || "this lift type"}`);
          return;
        }
      }
    }

    // Validate weight against maxAmount
    if (selectedLiftType && Number(formData.weight) > selectedLiftType.maxAmount) {
      toast.error(`Weight cannot exceed ${selectedLiftType.maxAmount} for ${selectedLiftType.name}`);
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";
      const response = await fetch(`${API_BASE_URL}/api/athlete-lifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          liftTypeId: Number(formData.liftTypeId),
          weight: Number(formData.weight),
          videoUrl: formData.videoUrl || null,
          isPr: prType === "allTime",
          isCurrentPr: prType === "current",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add lift");
        setLoading(false);
        return;
      }

      // Success - close modal and refresh
      toast.success(
        `${editingLift ? "Lift updated" : prType === "allTime" ? "All Time" : "Current"} PR lift ${editingLift ? "updated" : "added"} successfully!`
      );
      handleCloseModal();
      if (onLiftAdded) {
        onLiftAdded();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add lift");
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
          <FitnessCenter className="primary-blue" /> Athlete PR Lifts
        </Typography>

        {/* All Time PRs Subsection */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              All Time PRs
            </Typography>
            <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => handleOpenModal("allTime")}>
              Add New
            </Button>
          </Box>
          {allTimePRs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No all-time PRs recorded yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {allTimePRs.map((athleteLift, index) => (
                <Box
                  key={index}
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
                    <IconButton size="small" onClick={() => handleEdit(athleteLift)} aria-label="Edit lift">
                      <Edit fontSize="small" className="primary-blue" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(athleteLift)} aria-label="Delete lift">
                      <Delete color="error" fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {getLiftTypeName(athleteLift.liftTypeId)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1">
                      Weight:{" "}
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {Math.floor(athleteLift.weight)}
                      </Box>
                    </Typography>
                    {athleteLift.videoUrl && (
                      <IconButton component="a" href={athleteLift.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                        <Videocam className="primary-blue" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Current PRs Subsection */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Current PRs
            </Typography>
            <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => handleOpenModal("current")}>
              Add New
            </Button>
          </Box>
          {currentPRs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No current PRs recorded yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {currentPRs.map((athleteLift, index) => (
                <Box
                  key={index}
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
                    <IconButton size="small" onClick={() => handleEdit(athleteLift)} aria-label="Edit lift">
                      <Edit fontSize="small" className="primary-blue" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(athleteLift)} aria-label="Delete lift">
                      <Delete color="error" fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {getLiftTypeName(athleteLift.liftTypeId)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1">
                      Weight:{" "}
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {Math.floor(athleteLift.weight)}
                      </Box>
                    </Typography>
                    {athleteLift.videoUrl && (
                      <IconButton component="a" href={athleteLift.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
                        <Videocam className="primary-blue" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Add Lift Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" component="h2">
              {editingLift ? "Edit" : "Add"} {prType === "allTime" ? "All Time" : "Current"} PR Lift
            </Typography>
            <IconButton onClick={handleCloseModal} aria-label="close">
              <CloseIcon className="primary-blue" />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Lift Type</InputLabel>
              <Select name="liftTypeId" value={formData.liftTypeId} onChange={handleSelectChange} label="Lift Type">
                {liftTypes.map((liftType, index) => (
                  <MenuItem key={liftType.name} value={String(index + 1)}>
                    {liftType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{
                min: 0,
                max: formData.liftTypeId ? liftTypes[Number(formData.liftTypeId) - 1]?.maxAmount : undefined,
                step: 0.01,
              }}
              helperText={
                formData.liftTypeId
                  ? `Maximum weight: ${liftTypes[Number(formData.liftTypeId) - 1]?.maxAmount || "N/A"}`
                  : "Select a lift type to see maximum weight"
              }
              error={formData.liftTypeId && formData.weight ? Number(formData.weight) > (liftTypes[Number(formData.liftTypeId) - 1]?.maxAmount || 0) : false}
            />

            <TextField
              label="Video URL (optional)"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              fullWidth
              placeholder="https://youtube.com/watch?v=..."
              helperText="Link to a video of this lift"
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
                startIcon={loading ? <CircularProgress size={20} /> : editingLift ? <Save /> : <Add />}
              >
                {loading ? (editingLift ? "Updating..." : "Adding...") : editingLift ? "Update Lift" : "Add Lift"}
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
        title="Delete Lift"
        message="Are you sure you want to delete this lift? This action cannot be undone."
      />
    </Card>
  );
}

export default AthleteLifts;
