import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  Button,
  Modal,
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useModuleById } from "../../hooks/learn/useModulesApi";
import {
  useLessonsByModuleId,
  usePublishLesson,
  useDeleteLesson,
} from "../../hooks/learn/useLessonApi";
import { useState } from "react";
import LessonForm from "../../components/learn/forms/LessonForm";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublishIcon from "@mui/icons-material/Publish";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { EditIcon } from "lucide-react";
import type { Lesson } from "src/types/CourseLessons.types";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const ModuleDetails = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetLesson, setMenuTargetLesson] = useState<Lesson | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [lessonToPublish, setLessonToPublish] = useState<Lesson | null>(null);
  // Handlers
  const handleOpen = () => {
    setEditingLesson(null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    lesson?: Lesson | null
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuTargetLesson(lesson ?? null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTargetLesson(null);
  };

  const handleEdit = () => {
    // Open the lesson form modal in edit mode for the selected menu target
    if (menuTargetLesson) {
      setEditingLesson(menuTargetLesson);
      setOpen(true);
    }

    handleMenuClose();
  };

  const handleDeleteClick = () => {
    // open confirmation modal for the targeted lesson
    if (menuTargetLesson) {
      setLessonToDelete(menuTargetLesson);
      setDeleteConfirmOpen(true);
    }

    handleMenuClose();
  };

  const handlePublishClick = () => {
    if (menuTargetLesson) {
      setLessonToPublish(menuTargetLesson);
      setPublishConfirmOpen(true);
    }

    handleMenuClose();
  };

  const handleViewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const {
    data: moduleData,
    isLoading,
    isError,
  } = useModuleById(moduleId || "");

  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    isError: lessonsError,
  } = useLessonsByModuleId(moduleId || "");

  const deleteLessonMutation = useDeleteLesson();
  const publishLessonMutation = usePublishLesson();

  if (isLoading || lessonsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !moduleData) {
    return (
      <div className="text-center text-red-500">
        Failed to load module details.
      </div>
    );
  }

  const module = moduleData;
  const lessons = lessonsData?.data.lessons ?? [];

  // Decode escaped HTML entities if content was stored encoded
  const getHtmlContent = (text?: string | null) => {
    if (!text) return "";
    // If the content includes HTML-escaped characters like &lt; or &gt;, decode them
    if (/&lt;|&gt;|&amp;/.test(text)) {
      try {
        const doc = new DOMParser().parseFromString(text, "text/html");
        const decoded = doc.documentElement.textContent || text;
        return decoded;
      } catch (error) {
        console.error("Failed to decode HTML content:", error);
        return text;
      }
    }

    return text;
  };

  return (
    <div className="space-y-8">
      <div>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="text"
        >
          Back
        </Button>
      </div>
      {/* Module Header */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Typography variant="h5" fontWeight={600}>
                {module.title}
              </Typography>

              <Typography className="text-gray-600">
                {module.description}
              </Typography>
            </div>

            <Chip
              label={module.isPublished ? "Published" : "Draft"}
              color={module.isPublished ? "success" : "default"}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {module.isPreview && (
              <Chip label="Preview Module" variant="outlined" />
            )}

            <Chip
              label={`${module.estimatedDurationMinutes} minutes`}
              variant="outlined"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outlined" onClick={handleOpen}>
              Add Lesson
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Section */}
      <div className="space-y-4">
        <Typography variant="h6" fontWeight={600}>
          Module Lessons
        </Typography>

        {lessonsError && (
          <Card>
            <CardContent className="text-center text-red-500">
              Failed to load lessons.
            </CardContent>
          </Card>
        )}

        {lessons.length === 0 && !lessonsError && (
          <Card>
            <CardContent className="text-center text-gray-500">
              No lessons added to this module yet.
            </CardContent>
          </Card>
        )}

        {lessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => handleViewLesson(lesson)}
          >
            <CardContent className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Typography fontWeight={500}>{lesson.title}</Typography>

                <Typography
                  variant="body2"
                  className="text-gray-600 line-clamp-2"
                >
                  {lesson.description}
                </Typography>

                <Typography variant="body2" className="text-gray-500">
                  Duration: {lesson.durationMinutes} minutes
                </Typography>
              </div>

              <div className="flex items-center gap-2">
                <Chip
                  label={lesson.isPublished ? "Published" : "Draft"}
                  color={lesson.isPublished ? "success" : "default"}
                  size="small"
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, lesson);
                  }}
                  sx={{ position: "relative", zIndex: 2000 }}
                  aria-label="lesson actions"
                >
                  <MoreVertOutlinedIcon />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText> Edit</ListItemText>
        </MenuItem>
        {menuTargetLesson && (
          <MenuItem onClick={handlePublishClick}>
            <ListItemIcon>
              {menuTargetLesson.isPublished ? (
                <VisibilityOffIcon fontSize="small" color="inherit" />
              ) : (
                <PublishIcon fontSize="small" color="inherit" />
              )}
            </ListItemIcon>
            <ListItemText>
              {menuTargetLesson.isPublished ? "Unpublish" : "Publish"}
            </ListItemText>
          </MenuItem>
        )}
        <MenuItem sx={{ color: "error.main" }} onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {/* Publish Confirmation Modal */}
      <Modal
        open={publishConfirmOpen}
        onClose={() => {
          setPublishConfirmOpen(false);
          setLessonToPublish(null);
        }}
      >
        <Box sx={{ ...style, width: 480 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {lessonToPublish?.isPublished
              ? "Unpublish Lesson"
              : "Publish Lesson"}
          </Typography>

          <Typography className="mb-4">
            {lessonToPublish?.isPublished
              ? `Are you sure you want to unpublish "${lessonToPublish?.title}"? It will no longer be visible to learners.`
              : `Are you sure you want to publish "${lessonToPublish?.title}"?`}
          </Typography>

          <div className="flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={() => {
                setPublishConfirmOpen(false);
                setLessonToPublish(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color={lessonToPublish?.isPublished ? "warning" : "primary"}
              onClick={() => {
                if (!lessonToPublish) return;
                const desiredState = !lessonToPublish.isPublished;
                publishLessonMutation.mutate(
                  { lessonId: lessonToPublish.id, isPublished: desiredState },
                  {
                    onSuccess: () => {
                      setPublishConfirmOpen(false);
                      setLessonToPublish(null);
                    },
                  }
                );
              }}
              disabled={publishLessonMutation.isPending}
            >
              {(() => {
                if (publishLessonMutation.isPending) {
                  return lessonToPublish?.isPublished
                    ? "Unpublishing..."
                    : "Publishing...";
                }
                return lessonToPublish?.isPublished ? "Unpublish" : "Publish";
              })()}
            </Button>
          </div>
        </Box>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setLessonToDelete(null);
        }}
      >
        <Box sx={{ ...style, width: 480 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Delete Lesson
          </Typography>

          <Typography className="mb-4">
            Are you sure you want to delete "{lessonToDelete?.title}"? This
            action cannot be undone.
          </Typography>

          <div className="flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setLessonToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={deleteLessonMutation.isPending}
              onClick={() => {
                if (!lessonToDelete) return;
                deleteLessonMutation.mutate(lessonToDelete.id, {
                  onSuccess: () => {
                    setDeleteConfirmOpen(false);
                    setLessonToDelete(null);
                    // if currently viewing the deleted lesson, close viewer
                    setSelectedLesson((prev) =>
                      prev?.id === lessonToDelete.id ? null : prev
                    );
                  },
                });
              }}
            >
              {deleteLessonMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, maxHeight: "90vh", overflow: "auto" }}>
          <LessonForm
            initialLesson={editingLesson ?? undefined}
            onClose={() => {
              setOpen(false);
              setEditingLesson(null);
            }}
          />
        </Box>
      </Modal>
      {selectedLesson && (
        <Modal
          open={Boolean(selectedLesson)}
          onClose={() => setSelectedLesson(null)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", md: 900 },
              maxHeight: "90vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              overflowY: "auto",
            }}
          >
            <Card elevation={0}>
              <CardContent className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Typography variant="h5" fontWeight={600}>
                      {selectedLesson.title}
                    </Typography>

                    <Typography className="text-gray-600">
                      {selectedLesson.description}
                    </Typography>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Chip
                      label={selectedLesson.isPublished ? "Published" : "Draft"}
                      color={selectedLesson.isPublished ? "success" : "default"}
                    />
                    <Chip
                      label={selectedLesson.contentType}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>

                {/* Lesson Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Duration
                    </Typography>
                    <Typography fontWeight={500}>
                      {selectedLesson.durationMinutes} minutes
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Sort Order
                    </Typography>
                    <Typography fontWeight={500}>
                      {selectedLesson.sortOrder}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Last Updated
                    </Typography>
                    <Typography fontWeight={500}>
                      {new Date(selectedLesson.updatedAt).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>

                {/* Content Section */}
                {selectedLesson.contentType === "TEXT" && (
                  <div className="space-y-2">
                    <Typography variant="h6" fontWeight={600}>
                      Lesson Content
                    </Typography>

                    <Card variant="outlined">
                      <CardContent className="prose max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: getHtmlContent(selectedLesson.textContent),
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {selectedLesson.contentType === "VIDEO" && (
                  <div className="space-y-3">
                    <Typography variant="h6" fontWeight={600}>
                      Video Lesson
                    </Typography>

                    {selectedLesson.contentUrl ? (
                      <video
                        controls
                        className="w-full rounded-lg border"
                        src={selectedLesson.contentUrl}
                      >
                        <track kind="captions" src="" label="English" />
                      </video>
                    ) : (
                      <Typography className="text-gray-500">
                        Video uploaded via Mux
                      </Typography>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedLesson(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      )}
    </div>
  );
};
