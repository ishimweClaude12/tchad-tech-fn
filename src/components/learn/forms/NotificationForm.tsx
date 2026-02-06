import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Box,
  type SelectChangeEvent,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  IconButton,
} from "@mui/material";
import {
  Send,
  Users,
  Bell,
  MessageSquare,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import { useUsers } from "src/hooks/useApi";
import {
  NotificationType,
  RelatedEntityType,
  type NotificationPayload,
} from "src/types/Notifications.types";
import { useSendNotification } from "src/hooks/learn/useNotificationsApi";
import type { User } from "src/types/Users.types";
import { useCourses } from "src/hooks/learn/useCourseApi";
import type { Course } from "src/types/Course.types";
import { useAllQuizzes } from "src/hooks/learn/useQuizApi";
import type { Quiz } from "src/types/Quiz.types";

interface NotificationFormProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string;
  relatedType: RelatedEntityType;
}

const NOTIFICATION_TYPE_CONFIG = {
  [NotificationType.COURSE_UPDATE]: {
    label: "Course Update",
    color: "#3b82f6",
    icon: "📚",
  },
  [NotificationType.ASSIGNMENT_DUE]: {
    label: "Assignment Due",
    color: "#f59e0b",
    icon: "⏰",
  },
  [NotificationType.QUIZ_AVAILABLE]: {
    label: "Quiz Available",
    color: "#8b5cf6",
    icon: "📝",
  },
  [NotificationType.CERTIFICATE_EARNED]: {
    label: "Certificate Earned",
    color: "#10b981",
    icon: "🎓",
  },
  [NotificationType.REVIEW_REMINDER]: {
    label: "Review Reminder",
    color: "#eab308",
    icon: "⭐",
  },
  [NotificationType.SYSTEM]: {
    label: "System Notice",
    color: "#6b7280",
    icon: "⚙️",
  },
};

const RELATED_TYPE_CONFIG = {
  [RelatedEntityType.COURSE]: { label: "Course", icon: "📚" },
  [RelatedEntityType.QUIZ]: { label: "Quiz", icon: "📝" },
  [RelatedEntityType.CERTIFICATE]: { label: "Certificate", icon: "🎓" },
  [RelatedEntityType.SYSTEM]: { label: "System", icon: "⚙️" },
  [RelatedEntityType.ANNOUNCEMENT]: { label: "Announcement", icon: "📢" },
};

const NotificationForm = ({ open, onClose }: NotificationFormProps) => {
  const {
    data: usersData,
    isLoading: loadingUsers,
    error: usersError,
  } = useUsers("1", "100");

  const { data: coursesData, isLoading: loadingCourses } = useCourses();

  const { data: quizzesData, isLoading: loadingQuizzes } = useAllQuizzes();

  const [formData, setFormData] = useState<FormData>({
    userIds: [],
    type: NotificationType.SYSTEM,
    title: "",
    message: "",
    relatedId: "",
    relatedType: RelatedEntityType.SYSTEM,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const mutation = useSendNotification();

  const users = useMemo(() => usersData?.users || [], [usersData]);
  const courses = useMemo(
    () => coursesData?.data.courses || [],
    [coursesData?.data.courses],
  );
  const quizzes = useMemo(
    () => quizzesData?.data.quizzes || [],
    [quizzesData?.data.quizzes],
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (formData.userIds.length === 0) {
      newErrors.userIds = "Please select at least one user";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    // Only require relatedId for COURSE and QUIZ types
    if (
      (formData.relatedType === RelatedEntityType.COURSE ||
        formData.relatedType === RelatedEntityType.QUIZ) &&
      !formData.relatedId.trim()
    ) {
      newErrors.relatedId = "Related ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload: NotificationPayload = {
      userIds: formData.userIds,
      type: formData.type,
      title: formData.title.trim(),
      message: formData.message.trim(),
      relatedId:
        formData.relatedType === RelatedEntityType.COURSE ||
        formData.relatedType === RelatedEntityType.QUIZ
          ? formData.relatedId.trim()
          : "",
      relatedType: formData.relatedType,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFormData({
      userIds: [],
      type: NotificationType.SYSTEM,
      title: "",
      message: "",
      relatedId: "",
      relatedType: RelatedEntityType.SYSTEM,
    });
    setErrors({});
    onClose();
  };

  const handleUserChange = (_event: unknown, value: User[]) => {
    setFormData({
      ...formData,
      userIds: value.map((user) => user.userId),
    });
    if (errors.userIds) {
      setErrors({ ...errors, userIds: undefined });
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<NotificationType>) => {
    setFormData({ ...formData, type: event.target.value as NotificationType });
  };

  const handleRelatedTypeChange = (
    event: SelectChangeEvent<RelatedEntityType>,
  ) => {
    const newRelatedType = event.target.value as RelatedEntityType;
    setFormData({
      ...formData,
      relatedType: newRelatedType,
      relatedId: "", // Clear relatedId when type changes
    });
    if (errors.relatedId) {
      setErrors({ ...errors, relatedId: undefined });
    }
  };

  const handleRelatedEntityChange = (
    _event: unknown,
    value: Course | Quiz | null,
  ) => {
    setFormData({
      ...formData,
      relatedId: value?.id || "",
    });
    if (errors.relatedId) {
      setErrors({ ...errors, relatedId: undefined });
    }
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const selectedUsersCount = formData.userIds.length;
  const userCountText = selectedUsersCount === 1 ? "User" : "Users";
  const buttonText = mutation.isPending
    ? "Sending..."
    : `Send to ${selectedUsersCount || 0} ${userCountText}`;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell className="w-5 h-5 text-white" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Create Notification
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Send targeted notifications to learners
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small">
          x
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        {loadingUsers && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {usersError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load users. Please try again.
          </Alert>
        )}

        {!loadingUsers && !usersError && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* User Selection */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Users className="w-4 h-4 text-gray-600" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Select Recipients
                </Typography>
                {selectedUsersCount > 0 && (
                  <Chip
                    label={`${selectedUsersCount} selected`}
                    size="small"
                    color="primary"
                    sx={{ ml: "auto" }}
                  />
                )}
              </Box>
              <Autocomplete<User, true>
                multiple
                options={users}
                getOptionLabel={(option) =>
                  `${option.clerkProfile.firstName} ${option.clerkProfile.lastName} (${option.clerkProfile.emailAddresses?.[0]?.emailAddress || "No email"})`
                }
                value={users.filter((user) =>
                  formData.userIds.includes(user.userId),
                )}
                onChange={handleUserChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search and select users..."
                    error={!!errors.userIds}
                    helperText={errors.userIds}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.userId}>
                    {`${option.clerkProfile.firstName} ${option.clerkProfile.lastName} (${option.clerkProfile.emailAddresses?.[0]?.emailAddress || "No email"})`}
                  </li>
                )}
              />
            </Box>

            {/* Notification Type */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Tag className="w-4 h-4 text-gray-600" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Notification Type
                </Typography>
              </Box>
              <FormControl fullWidth>
                <Select value={formData.type} onChange={handleTypeChange}>
                  {Object.entries(NOTIFICATION_TYPE_CONFIG).map(
                    ([key, config]) => (
                      <MenuItem key={key} value={key}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <span>{config.icon}</span>
                          <span>{config.label}</span>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: config.color,
                              ml: "auto",
                            }}
                          />
                        </Box>
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Box>

            {/* Title */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Notification Title
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g., New Quiz Available in React Fundamentals"
                value={formData.title}
                onChange={handleInputChange("title")}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Box>

            {/* Message */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Message
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Write a detailed message for your users..."
                value={formData.message}
                onChange={handleInputChange("message")}
                error={!!errors.message}
                helperText={
                  errors.message || `${formData.message.length} characters`
                }
              />
            </Box>

            {/* Related Entity */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  formData.relatedType === RelatedEntityType.COURSE ||
                  formData.relatedType === RelatedEntityType.QUIZ
                    ? "1fr 1fr"
                    : "1fr",
                gap: 2,
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Tag className="w-4 h-4 text-gray-600" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Related Type
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <Select
                    value={formData.relatedType}
                    onChange={handleRelatedTypeChange}
                  >
                    {Object.entries(RELATED_TYPE_CONFIG).map(
                      ([key, config]) => (
                        <MenuItem key={key} value={key}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <span>{config.icon}</span>
                            <span>{config.label}</span>
                          </Box>
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              </Box>

              {(formData.relatedType === RelatedEntityType.COURSE ||
                formData.relatedType === RelatedEntityType.QUIZ) && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <LinkIcon className="w-4 h-4 text-gray-600" />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Related{" "}
                      {formData.relatedType === RelatedEntityType.COURSE
                        ? "Course"
                        : "Quiz"}
                    </Typography>
                  </Box>
                  {formData.relatedType === RelatedEntityType.COURSE ? (
                    <Autocomplete<Course>
                      options={courses}
                      getOptionLabel={(option) => option.title}
                      value={
                        courses.find(
                          (course) => course.id === formData.relatedId,
                        ) || null
                      }
                      onChange={handleRelatedEntityChange}
                      loading={loadingCourses}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select a course..."
                          error={!!errors.relatedId}
                          helperText={errors.relatedId}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.title}
                        </li>
                      )}
                    />
                  ) : (
                    <Autocomplete<Quiz>
                      options={quizzes}
                      getOptionLabel={(option) => option.title}
                      value={
                        quizzes.find(
                          (quiz) => quiz.id === formData.relatedId,
                        ) || null
                      }
                      onChange={handleRelatedEntityChange}
                      loading={loadingQuizzes}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select a quiz..."
                          error={!!errors.relatedId}
                          helperText={errors.relatedId}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.title}
                        </li>
                      )}
                    />
                  )}
                </Box>
              )}
            </Box>

            {/* Preview Box */}
            {formData.title && formData.message && (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: "divider",
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  mb={1}
                >
                  PREVIEW
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor:
                          NOTIFICATION_TYPE_CONFIG[formData.type].color + "20",
                      }}
                    >
                      <span>
                        {NOTIFICATION_TYPE_CONFIG[formData.type].icon}
                      </span>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {formData.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {formData.message}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                    <Chip
                      label={NOTIFICATION_TYPE_CONFIG[formData.type].label}
                      size="small"
                      sx={{ fontSize: "0.7rem" }}
                    />
                    <Chip
                      label={RELATED_TYPE_CONFIG[formData.relatedType].label}
                      size="small"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          px: 3,
          py: 2,
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mutation.isPending || loadingUsers}
          startIcon={
            mutation.isPending ? (
              <CircularProgress size={16} />
            ) : (
              <Send className="w-4 h-4" />
            )
          }
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #66408a 100%)",
            },
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationForm;
