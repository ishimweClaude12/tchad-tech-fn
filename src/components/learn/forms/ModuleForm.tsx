// components/modules/ModuleFormModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import {
  Close,
  Save,
  Add,
  AccessTime,
  Sort,
  Preview,
  Public,
} from "@mui/icons-material";
import type { ModuleFormData } from "../../../types/Module.types";

interface ModuleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleFormData) => Promise<void> | void;
  initialData?: Partial<ModuleFormData>;
  loading?: boolean;
  error?: string;
  courses: Array<{ id: string; title: string }>;
  loadingCourses: boolean;

  mode?: "create" | "edit";
}

const ModuleFormModal: React.FC<ModuleFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  error,
  courses,
  mode = "create",
}) => {
  const getInitialFormData = (
    initial?: Partial<ModuleFormData>
  ): ModuleFormData => {
    if (initial) {
      return {
        courseId: initial.courseId || "",
        title: initial.title || "",
        description: initial.description || "",
        sortOrder: initial.sortOrder || 1,
        isPreview: initial.isPreview || false,
        estimatedDurationMinutes: initial.estimatedDurationMinutes || 60,
        isPublished: initial.isPublished || false,
      };
    }
    return {
      courseId: "",
      title: "",
      description: "",
      sortOrder: 1,
      isPreview: false,
      estimatedDurationMinutes: 60,
      isPublished: false,
    };
  };

  // Form state
  const [formData, setFormData] = useState<ModuleFormData>(() =>
    getInitialFormData(initialData)
  );

  // Validation state
  const [errors, setErrors] = useState<
    Partial<Record<keyof ModuleFormData, string>>
  >({});

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ModuleFormData, string>> = {};

    if (!formData.courseId.trim()) {
      newErrors.courseId = "Please select a course";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Module title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (formData.sortOrder < 1) {
      newErrors.sortOrder = "Sort order must be at least 1";
    }

    if (formData.estimatedDurationMinutes < 1) {
      newErrors.estimatedDurationMinutes = "Duration must be at least 1 minute";
    } else if (formData.estimatedDurationMinutes > 1000) {
      newErrors.estimatedDurationMinutes =
        "Duration cannot exceed 1000 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  // Handle input changes
  const handleChange =
    (field: keyof ModuleFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "sortOrder" || field === "estimatedDurationMinutes"
            ? Number(value)
            : value,
      }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  // Handle numeric input with validation
  const handleNumericChange =
    (field: "sortOrder" | "estimatedDurationMinutes") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Allow only numbers
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [field]: value === "" ? 0 : parseInt(value, 10),
        }));

        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      }
    };

  // Get title based on mode
  const getTitle = () => {
    return mode === "create" ? "Create New Module" : "Edit Module";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-2xl shadow-2xl",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <DialogTitle className="relative border-b bg-linear-to-r from-blue-50 to-indigo-50">
          <Box className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                {mode === "create" ? (
                  <Add className="text-blue-600" />
                ) : (
                  <Save className="text-blue-600" />
                )}
              </div>
              <div>
                <Typography variant="h5" className="font-bold text-gray-900">
                  {getTitle()}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {mode === "create"
                    ? "Add a new module to your course"
                    : "Update module details"}
                </Typography>
              </div>
            </div>
            <IconButton
              onClick={onClose}
              className="hover:bg-gray-100"
              disabled={loading}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Error Alert */}
        {error && (
          <div className="px-6 pt-4">
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          </div>
        )}

        {/* Form Content */}
        <DialogContent className="pt-6">
          <Grid container spacing={3}>
            {/* Course Selection */}
            <Grid>
              <FormControl
                fullWidth
                error={!!errors.courseId}
                className="bg-white"
              >
                <InputLabel id="course-select-label">
                  Select Course *
                </InputLabel>
                <Select
                  labelId="course-select-label"
                  value={formData.courseId}
                  onChange={handleChange("courseId")}
                  label="Select Course *"
                  disabled={loading}
                  className="rounded-lg"
                >
                  <MenuItem value="">
                    <em>Select a course</em>
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
                {errors.courseId && (
                  <Typography
                    variant="caption"
                    className="text-red-500 mt-1 ml-3"
                  >
                    {errors.courseId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Title */}
            <Grid>
              <TextField
                fullWidth
                label="Module Title *"
                value={formData.title}
                onChange={handleChange("title")}
                error={!!errors.title}
                helperText={
                  errors.title || "Enter a descriptive title for your module"
                }
                disabled={loading}
                className="bg-white rounded-lg"
                InputProps={{
                  className: "rounded-lg",
                }}
                placeholder="e.g., Introduction to Web Development"
              />
            </Grid>

            {/* Description */}
            <Grid>
              <TextField
                fullWidth
                label="Description *"
                value={formData.description}
                onChange={handleChange("description")}
                error={!!errors.description}
                helperText={
                  errors.description ||
                  "Describe what students will learn in this module"
                }
                disabled={loading}
                multiline
                rows={4}
                className="bg-white rounded-lg"
                InputProps={{
                  className: "rounded-lg",
                }}
                placeholder="This module covers the fundamentals of..."
              />
            </Grid>

            <Grid>
              <Divider className="my-2" />
              <Typography variant="subtitle2" className="text-gray-500 mb-4">
                Module Settings
              </Typography>
            </Grid>

            {/* Sort Order & Duration */}
            <Grid>
              <TextField
                fullWidth
                label="Sort Order"
                value={formData.sortOrder || ""}
                onChange={handleNumericChange("sortOrder")}
                error={!!errors.sortOrder}
                helperText={
                  errors.sortOrder || "Position in the course sequence"
                }
                disabled={loading}
                type="text"
                className="bg-white rounded-lg"
                InputProps={{
                  className: "rounded-lg",
                  startAdornment: (
                    <Sort className="text-gray-400 mr-2" fontSize="small" />
                  ),
                }}
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                label="Duration (minutes)"
                value={formData.estimatedDurationMinutes || ""}
                onChange={handleNumericChange("estimatedDurationMinutes")}
                error={!!errors.estimatedDurationMinutes}
                helperText={
                  errors.estimatedDurationMinutes ||
                  "Estimated time to complete"
                }
                disabled={loading}
                type="text"
                className="bg-white rounded-lg"
                InputProps={{
                  className: "rounded-lg",
                  startAdornment: (
                    <AccessTime
                      className="text-gray-400 mr-2"
                      fontSize="small"
                    />
                  ),
                }}
              />
            </Grid>

            {/* Toggles */}
            <Grid>
              <Box className="p-4 border rounded-lg hover:border-blue-300 transition-colors bg-gray-50">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPreview}
                      onChange={handleChange("isPreview")}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label={
                    <div className="flex items-center gap-2">
                      <Preview fontSize="small" className="text-gray-600" />
                      <div>
                        <Typography className="font-medium">
                          Preview Module
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          Allow students to preview this module for free
                        </Typography>
                      </div>
                    </div>
                  }
                />
              </Box>
            </Grid>

            <Grid>
              <Box className="p-4 border rounded-lg hover:border-blue-300 transition-colors bg-gray-50">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={handleChange("isPublished")}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label={
                    <div className="flex items-center gap-2">
                      <Public fontSize="small" className="text-gray-600" />
                      <div>
                        <Typography className="font-medium">
                          Publish Module
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          Make this module available to students
                        </Typography>
                      </div>
                    </div>
                  }
                />
              </Box>
            </Grid>

            {/* Summary Preview */}
            <Grid>
              <Box className="mt-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
                <Typography
                  variant="subtitle2"
                  className="font-semibold text-blue-800 mb-2"
                >
                  Module Summary
                </Typography>
                <Grid container spacing={1}>
                  <Grid>
                    <Typography variant="caption" className="text-gray-600">
                      Title:
                    </Typography>
                    <Typography className="font-medium truncate">
                      {formData.title || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="caption" className="text-gray-600">
                      Duration:
                    </Typography>
                    <Typography className="font-medium">
                      {formData.estimatedDurationMinutes} min
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="caption" className="text-gray-600">
                      Preview:
                    </Typography>
                    <Typography className="font-medium">
                      {formData.isPreview ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="caption" className="text-gray-600">
                      Published:
                    </Typography>
                    <Typography className="font-medium">
                      {formData.isPublished ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Actions */}
        <DialogActions className="border-t p-4 bg-gray-50">
          <Button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-6 py-2 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="rounded-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 shadow-md"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save />
              )
            }
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create Module"
              : "Update Module"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModuleFormModal;
