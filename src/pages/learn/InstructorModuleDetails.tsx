import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  Button,
  Modal,
  Box,
  Breadcrumbs,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useModuleById } from "../../hooks/learn/useModulesApi";
import {
  useDeleteLesson,
  useLessonsByModuleId,
  usePublishLesson,
} from "../../hooks/learn/useLessonApi";
import { useState } from "react";

import type { Lesson } from "src/types/CourseLessons.types";
import {
  useModuleQuizzes,
  useLessonQuizzes,
  useCreateQuiz,
  useDeleteQuiz,
  useUpdateQuiz,
} from "../../hooks/learn/useQuizApi";
import QuizCard from "../../components/learn/QuizCard";
import { useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import LessonForm from "src/components/learn/forms/LessonForm";
import QuizFormModal from "src/components/learn/forms/QuizForm";
import type { Quiz } from "src/types/Quiz.types";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import PublishIcon from "@mui/icons-material/Publish";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// Decode HTML entities while preserving HTML structure
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

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

export const InstructorModuleDetails = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetLesson, setMenuTargetLesson] = useState<Lesson | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [lessonToPublish, setLessonToPublish] = useState<Lesson | null>(null);
  const [openQuizForm, setOpenQuizForm] = useState<boolean>(false);
  const [openQuizDelete, setOpenQuizDelete] = useState<boolean>(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [openLessonQuizForm, setOpenLessonQuizForm] = useState<boolean>(false);
  const [editingLessonQuiz, setEditingLessonQuiz] = useState<Quiz | null>(null);
  const [lessonQuizToDelete, setLessonQuizToDelete] = useState<Quiz | null>(
    null,
  );
  const [openLessonQuizDelete, setOpenLessonQuizDelete] =
    useState<boolean>(false);
  // Handlers
  const handleOpen = () => {
    setEditingLesson(null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    lesson?: Lesson | null,
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

  // Quiz handlers
  const handleOpenQuizForm = () => {
    setEditingQuiz(null);
    setOpenQuizForm(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setOpenQuizForm(true);
  };

  const handleDeleteQuiz = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setOpenQuizDelete(true);
  };

  const handleConfirmDeleteQuiz = () => {
    if (!quizToDelete) return;
    deleteQuizMutation.mutate(quizToDelete.id, {
      onSuccess: () => {
        setOpenQuizDelete(false);
        setQuizToDelete(null);
        queryClient.invalidateQueries({
          queryKey: ["moduleQuizzes", moduleId],
        });
      },
    });
  };

  // Lesson-specific quiz handlers
  const handleOpenLessonQuizForm = () => {
    setEditingLessonQuiz(null);

    setOpenLessonQuizForm(true);
  };

  const handleEditLessonQuiz = (quiz: Quiz) => {
    setEditingLessonQuiz(quiz);
    setOpenLessonQuizForm(true);
  };

  const handleDeleteLessonQuiz = (quiz: Quiz) => {
    setLessonQuizToDelete(quiz);
    setOpenLessonQuizDelete(true);
  };

  const handleConfirmDeleteLessonQuiz = () => {
    if (!lessonQuizToDelete) return;
    deleteQuizMutation.mutate(lessonQuizToDelete.id, {
      onSuccess: () => {
        setOpenLessonQuizDelete(false);
        setLessonQuizToDelete(null);
        queryClient.invalidateQueries({
          queryKey: ["lessonQuizzes", selectedLesson?.id],
        });
      },
    });
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

  const {
    data: quizzesData,
    isLoading: isQuizzesLoading,
    error: quizzesError,
  } = useModuleQuizzes(moduleId || "");

  const { data: lessonQuizes, isLoading: lessonQuizesLoading } =
    useLessonQuizzes(selectedLesson?.id || "");

  const deleteLessonMutation = useDeleteLesson();
  const publishLessonMutation = usePublishLesson();
  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();

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

  return (
    <div className="space-y-8 p-6">
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/learn/dashboard/instructor/courses">
            Courses
          </Link>
          <Link
            color="inherit"
            to={`/learn/dashboard/instructor/course/${module.courseId}`}
          >
            {module.course.title}
          </Link>
          <Typography sx={{ color: "text.primary" }}>{module.title}</Typography>
        </Breadcrumbs>
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
            <Button variant="contained" onClick={handleOpenQuizForm}>
              Add Quiz
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

      {/* Quizes */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Module Quizzes
        </Typography>

        {quizzesError && (
          <div className="text-center text-red-500 mt-2">
            Failed to load module quizzes.
          </div>
        )}

        {isQuizzesLoading && (
          <div className="flex justify-center items-center h-64 mt-4">
            <CircularProgress />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {quizzesData?.data.quizzes.length === 0 && (
            <div className="text-gray-600">
              No quizzes available for this course.
            </div>
          )}

          {quizzesData?.data.quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onClick={() => {
                navigate(
                  `/learn/dashboard/courses/${module.courseId}/module/${moduleId}/quiz/${quiz.id}`,
                );
              }}
              onEdit={(quiz) => {
                handleEditQuiz(quiz);
              }}
              onDelete={(quiz) => {
                handleDeleteQuiz(quiz);
              }}
              onViewAttempts={(quiz) => {
                navigate(
                  `/learn/dashboard/instructor/course/${module.courseId}/module/${moduleId}/quiz/${quiz.id}`,
                );
              }}
            />
          ))}
        </div>
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
                  },
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
                      prev?.id === lessonToDelete.id ? null : prev,
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

      {/* Quiz Form Modal */}
      <QuizFormModal
        open={openQuizForm}
        onClose={() => {
          setOpenQuizForm(false);
          setEditingQuiz(null);
        }}
        quiz={editingQuiz}
        createQuizMutation={createQuizMutation}
        updateQuizMutation={updateQuizMutation}
        queryClient={queryClient}
        moduleId={moduleId}
        onSuccessCallback={() => {
          queryClient.invalidateQueries({
            queryKey: ["moduleQuizzes", moduleId],
          });
        }}
      />

      {/* Lesson-specific Quiz Form Modal */}
      <QuizFormModal
        open={openLessonQuizForm}
        onClose={() => {
          setOpenLessonQuizForm(false);
          setEditingLessonQuiz(null);
        }}
        quiz={editingLessonQuiz}
        createQuizMutation={createQuizMutation}
        updateQuizMutation={updateQuizMutation}
        queryClient={queryClient}
        lessonId={selectedLesson?.id}
        onSuccessCallback={() => {
          queryClient.invalidateQueries({
            queryKey: ["lessonQuizzes", selectedLesson?.id],
          });
        }}
      />

      {selectedLesson && !openLessonQuizForm && (
        <Modal
          open={Boolean(selectedLesson)}
          onClose={() => setSelectedLesson(null)}
          sx={{ zIndex: 1500 }}
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
                          className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:list-disc prose-ul:my-4 prose-ol:list-decimal prose-ol:my-4
                prose-li:text-gray-700 prose-li:my-1
                prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:my-4
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-4
                [&_p:empty]:h-6"
                          dangerouslySetInnerHTML={{
                            __html: decodeHTMLEntities(
                              selectedLesson.textContent || "",
                            ),
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

                    <video
                      controls
                      className="w-full rounded-lg border"
                      src={selectedLesson.contentUrl}
                    >
                      <track
                        kind="captions"
                        src={selectedLesson.contentUrl}
                        label="English"
                      />
                    </video>
                  </div>
                )}

                {/* Quizzes Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="h6" fontWeight={600}>
                      Associated Quizzes
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleOpenLessonQuizForm}
                    >
                      Add Quiz
                    </Button>
                  </div>
                  {lessonQuizesLoading && (
                    <div className="flex justify-center items-center h-32">
                      <CircularProgress />
                    </div>
                  )}
                  {!lessonQuizesLoading &&
                    lessonQuizes?.data.quizzes.length === 0 && (
                      <Typography className="text-gray-600">
                        No quizzes associated with this lesson.
                      </Typography>
                    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessonQuizes?.data.quizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onClick={() => {
                          navigate(
                            `/learn/dashboard/courses/${module.courseId}/module/${moduleId}/quiz/${quiz.id}`,
                          );
                        }}
                        onEdit={(quiz) => {
                          handleEditLessonQuiz(quiz);
                        }}
                        onDelete={(quiz) => {
                          handleDeleteLessonQuiz(quiz);
                        }}
                        onViewAttempts={(quiz) => {
                          navigate(
                            `/learn/dashboard/instructor/course/${module.courseId}/module/${moduleId}/quiz/${quiz.id}`,
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>

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

      {/* Quiz Delete Confirmation Modal */}
      <Modal
        open={openQuizDelete}
        onClose={() => {
          setOpenQuizDelete(false);
          setQuizToDelete(null);
        }}
      >
        <Box sx={{ ...style, width: 480 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Delete Quiz
          </Typography>

          <Typography className="mb-4">
            Are you sure you want to delete "{quizToDelete?.title}"? This action
            cannot be undone.
          </Typography>

          <div className="flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={() => {
                setOpenQuizDelete(false);
                setQuizToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={deleteQuizMutation.isPending}
              onClick={handleConfirmDeleteQuiz}
            >
              {deleteQuizMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Lesson Quiz Delete Confirmation Modal */}
      <Modal
        open={openLessonQuizDelete}
        onClose={() => {
          setOpenLessonQuizDelete(false);
          setLessonQuizToDelete(null);
        }}
      >
        <Box sx={{ ...style, width: 480 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Delete Quiz
          </Typography>

          <Typography className="mb-4">
            Are you sure you want to delete "{lessonQuizToDelete?.title}"? This
            action cannot be undone.
          </Typography>

          <div className="flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={() => {
                setOpenLessonQuizDelete(false);
                setLessonQuizToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={deleteQuizMutation.isPending}
              onClick={handleConfirmDeleteLessonQuiz}
            >
              {deleteQuizMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
