import React, { useState } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  InfoOutlined,
  PublicOutlined,
  LockOutlined,
  SendOutlined,
  SaveOutlined,
} from "@mui/icons-material";

export interface AnnouncementPayload {
  courseId: string;
  authorId: string;
  title: string;
  content: string;
  isGlobal: boolean;
  isPublished: boolean;
  expiresAt?: string;
}

interface AnnouncementFormProps {
  authorId: string;
  courses?: Array<{ id: string; name: string }>;
  onSubmit: (payload: AnnouncementPayload) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<AnnouncementPayload>;
  mode?: "create" | "update";
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  authorId,
  courses = [],
  onSubmit,
  onCancel,
  initialData,
  mode = "create",
}) => {
  const [formData, setFormData] = useState<AnnouncementPayload>({
    courseId: initialData?.courseId || "",
    authorId: authorId,
    title: initialData?.title || "",
    content: initialData?.content || "",
    isGlobal: initialData?.isGlobal || false,
    isPublished: initialData?.isPublished || false,
    expiresAt: initialData?.expiresAt || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AnnouncementPayload, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AnnouncementPayload, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must not exceed 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }

    if (!formData.isGlobal && !formData.courseId) {
      newErrors.courseId =
        "Please select a course or make the announcement global";
    }

    if (formData.expiresAt) {
      const expiryDate = new Date(formData.expiresAt);
      const now = new Date();
      if (expiryDate <= now) {
        newErrors.expiresAt = "Expiry date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          courseId: "",
          authorId: authorId,
          title: "",
          content: "",
          isGlobal: false,
          isPublished: false,
          expiresAt: "",
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to ${mode} announcement`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof AnnouncementPayload,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const characterCount = formData.content.length;
  const titleCount = formData.title.length;

  const getSubmitButtonText = (): string => {
    if (isSubmitting) {
      return "Processing...";
    }
    if (formData.isPublished) {
      return mode === "create" ? "Publish Announcement" : "Update & Publish";
    }
    return mode === "create" ? "Save as Draft" : "Update Draft";
  };

  const getSubmitIcon = () => {
    if (isSubmitting) {
      return <CircularProgress size={20} color="inherit" />;
    }
    if (formData.isPublished) {
      return <SendOutlined />;
    }
    return <SaveOutlined />;
  };

  return (
    <div className="py-4">
      {/* Success Alert */}
      {submitSuccess && (
        <div className="mb-6 animate-slide-in">
          <Alert severity="success" className="shadow-lg">
            Announcement {mode === "create" ? "created" : "updated"}{" "}
            successfully!
          </Alert>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="mb-6 animate-slide-in">
          <Alert severity="error" className="shadow-lg">
            {submitError}
          </Alert>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scope Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Announcement Scope
            </h2>
            <Chip
              icon={formData.isGlobal ? <PublicOutlined /> : <LockOutlined />}
              label={formData.isGlobal ? "Global" : "Course-Specific"}
              color={formData.isGlobal ? "primary" : "default"}
              className="animate-pulse-subtle"
            />
          </div>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isGlobal}
                onChange={(e) => handleChange("isGlobal", e.target.checked)}
                color="primary"
              />
            }
            label={
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium">
                  Make this a global announcement
                </span>
                <Tooltip title="Global announcements are visible to all users across all courses">
                  <IconButton size="small">
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            }
          />

          {/* Course Selection - Only show if not global */}
          {!formData.isGlobal && (
            <div className="animate-fade-in">
              <FormControl fullWidth error={!!errors.courseId}>
                <InputLabel id="course-select-label">Select Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  value={formData.courseId}
                  label="Select Course"
                  onChange={(e) => handleChange("courseId", e.target.value)}
                  className="bg-slate-50"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.courseId && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
                )}
              </FormControl>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200"></div>

        {/* Title Input */}
        <div className="space-y-2">
          <label
            htmlFor="announcement-title"
            className="block text-base font-semibold text-slate-800"
          >
            Announcement Title
          </label>
          <TextField
            fullWidth
            placeholder="Enter a clear and concise title..."
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title || `${titleCount}/200 characters`}
            variant="outlined"
            className="bg-slate-50"
            slotProps={{ htmlInput: { maxLength: 200 } }}
          />
        </div>

        {/* Content Input */}
        <div className="space-y-2">
          <label
            htmlFor="announcement-content"
            className="block text-base font-semibold text-slate-800"
          >
            Content
          </label>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Write your announcement content here... Be clear and informative."
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            error={!!errors.content}
            helperText={errors.content || `${characterCount} characters`}
            variant="outlined"
            className="bg-slate-50"
          />
        </div>

        {/* Expiry Date Input */}
        <div className="space-y-2">
          <label
            htmlFor="announcement-expiry-date"
            className="block text-base font-semibold text-slate-800"
          >
            Expiry Date (Optional)
          </label>
          <TextField
            fullWidth
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => handleChange("expiresAt", e.target.value)}
            error={!!errors.expiresAt}
            helperText={
              errors.expiresAt ||
              "Set when this announcement should expire and no longer be visible"
            }
            variant="outlined"
            className="bg-slate-50"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200"></div>

        {/* Publishing Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Publishing Options
          </h2>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublished}
                onChange={(e) => handleChange("isPublished", e.target.checked)}
                color="success"
              />
            }
            label={
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium">
                  {formData.isPublished
                    ? "Publish immediately"
                    : "Save as draft"}
                </span>
                <Tooltip
                  title={
                    formData.isPublished
                      ? "Users will see this announcement immediately"
                      : "Save without publishing - you can publish later"
                  }
                >
                  <IconButton size="small">
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            }
          />

          {formData.isPublished && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
              <p className="text-green-800 text-sm flex items-center gap-2">
                <PublicOutlined fontSize="small" />
                This announcement will be visible to{" "}
                {formData.isGlobal ? "all users" : "course participants"}{" "}
                immediately
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {onCancel && (
            <Button
              variant="outlined"
              size="large"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={getSubmitIcon()}
            className="flex-1"
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      </form>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <InfoOutlined />
          Tips for Great Announcements
        </h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              Use clear, descriptive titles that immediately convey the purpose
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Keep content concise and action-oriented</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              Global announcements reach all users - use sparingly for
              platform-wide updates
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Save as draft to review before publishing</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AnnouncementForm;
