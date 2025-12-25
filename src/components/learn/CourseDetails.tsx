import {
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Typography,
  Button,
  Divider,
  Rating,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useCourseById,
  useCourseModules,
} from "../../hooks/learn/useCourseApi";
import { useState } from "react";
import type { ModuleFormData, Module } from "src/types/Module.types";

import ModuleFormModal from "./forms/ModuleForm";
import {
  queryKeys,
  useCreateModule,
  useDeleteModule,
  useToggleModulePublished,
} from "../../hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import { EditIcon } from "lucide-react";
import { useUpdateModule } from "../../hooks/learn/useModulesApi";
import PublishIcon from "@mui/icons-material/PublishOutlined";
import UnpublishIcon from "@mui/icons-material/UnpublishedOutlined";
import toast from "react-hot-toast";

export const CourseDetails = () => {
  const queryClient = useQueryClient();
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openPublishConfirm, setOpenPublishConfirm] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: modulesData, isLoading, error } = useCourseModules(courseId);
  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourseById(courseId);
  const createModuleMutation = useCreateModule();
  const deleteModuleMutation = useDeleteModule();
  const toggleModulePublishMutation = useToggleModulePublished();
  const updateModuleMutation = useUpdateModule();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!courseId) {
    return <div className="text-center text-gray-600">No course selected.</div>;
  }

  if (isLoading || isCourseLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error || courseError) {
    return (
      <div className="text-center text-red-500">
        Failed to load course details.
      </div>
    );
  }

  const course = courseData?.data.course;
  const modules = modulesData?.data.modules ?? [];

  if (!course) return null;

  return (
    <div className="space-y-10">
      <div>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="text"
        >
          Back
        </Button>
      </div>
      {/* Header */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-56 rounded bg-gray-100 overflow-hidden">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="md:col-span-3 space-y-4">
            <Typography variant="h4" fontWeight={600}>
              {course.title}
            </Typography>

            <Typography className="text-gray-600">{course.subtitle}</Typography>

            <div className="flex flex-wrap gap-2">
              <Chip label={course.difficultyLevel} />
              <Chip label={course.category?.name} />
              {course.hasCertificate && (
                <Chip label="Certificate" color="success" />
              )}
            </div>

            <div className="flex items-center gap-4">
              <Rating
                value={course.ratingAverage ?? 0}
                precision={0.5}
                readOnly
              />
              <Typography className="text-sm text-gray-600">
                ({course.ratingCount} ratings)
              </Typography>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outlined" onClick={() => setOpenCreate(true)}>
                Add Module
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Details */}
      <Card>
        <CardContent className="space-y-6">
          <Typography variant="h6" fontWeight={600}>
            Course Overview
          </Typography>

          <Typography className="text-gray-700">
            {course.description}
          </Typography>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography fontWeight={500}>Target Audience</Typography>
              <Typography className="text-gray-600">
                {course.targetAudience}
              </Typography>
            </div>

            <div>
              <Typography fontWeight={500}>Prerequisites</Typography>
              <Typography className="text-gray-600">
                {course.prerequisites}
              </Typography>
            </div>

            <div>
              <Typography fontWeight={500}>Language</Typography>
              <Typography className="text-gray-600">English</Typography>
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Typography fontWeight={600}>{course.totalLessons}</Typography>
              <Typography className="text-sm text-gray-600">Lessons</Typography>
            </div>

            <div>
              <Typography fontWeight={600}>
                {course.estimatedDurationHours} hrs
              </Typography>
              <Typography className="text-sm text-gray-600">
                Duration
              </Typography>
            </div>

            <div>
              <Typography fontWeight={600}>{course.enrollmentCount}</Typography>
              <Typography className="text-sm text-gray-600">
                Enrolled
              </Typography>
            </div>

            <div>
              <Typography fontWeight={600}>{course.completionCount}</Typography>
              <Typography className="text-sm text-gray-600">
                Completed
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        <Typography variant="h5" fontWeight={600}>
          Course Modules
        </Typography>

        {modules.length === 0 ? (
          <Card>
            <CardContent className="text-center text-gray-500">
              No modules added yet.
            </CardContent>
          </Card>
        ) : (
          modules.map((module) => (
            <Card
              key={module.id}
              onClick={() => navigate(`module/${module.id}`)}
              className="cursor-pointer transition hover:shadow-lg"
            >
              <CardContent className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <Typography fontWeight={600}>{module.title}</Typography>

                  <Typography variant="body2" className="text-gray-600">
                    {module.description}
                  </Typography>

                  <Typography variant="body2" className="text-gray-500">
                    Duration: {module.estimatedDurationMinutes} minutes
                  </Typography>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Chip
                    label={module.isPublished ? "Published" : "Draft"}
                    color={module.isPublished ? "success" : "default"}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: "relative", zIndex: 2000 }}
                    aria-label="lesson actions"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModule(module);
                      setAnchorEl(e.currentTarget);
                    }}
                  >
                    <MoreVertOutlinedIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          handleMenuClose();
          setSelectedModule(null);
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenEdit(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText> Edit</ListItemText>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenDelete(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (!selectedModule) return;
            setOpenPublishConfirm(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {selectedModule?.isPublished ? (
              <UnpublishIcon fontSize="small" />
            ) : (
              <PublishIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedModule?.isPublished ? "Unpublish" : "Publish"}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      {selectedModule && (
        <ModuleFormModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSubmit={(data: ModuleFormData) => {
            if (!selectedModule) return;
            updateModuleMutation.mutate(
              { id: selectedModule.id, data },
              {
                onSuccess: () => {
                  setOpenEdit(false);
                  setSelectedModule(null);
                  queryClient.invalidateQueries({
                    queryKey: [queryKeys.courses.modules(courseId)],
                  });
                },
              }
            );
          }}
          initialData={selectedModule}
          loading={updateModuleMutation.isPending}
          error={updateModuleMutation.error?.message ?? ""}
          courses={courseData.data ? [courseData.data.course] : []}
          loadingCourses={isCourseLoading}
          mode={"edit"}
        />
      )}

      {/* Create Dialog */}
      <ModuleFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={(data: ModuleFormData) => {
          createModuleMutation.mutate(data, {
            onSuccess: () => {
              setOpenCreate(false);
            },
          });
        }}
        initialData={undefined}
        loading={false}
        error={undefined}
        courses={courseData.data ? [courseData.data.course] : []}
        loadingCourses={isCourseLoading}
        mode={"create"}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent className="py-4">
          <Typography>
            Are you sure you want to delete the module "{selectedModule?.title}"
            ?
          </Typography>
          <div className="mt-4 flex justify-end space-x-2 gap-2">
            <Button onClick={() => setOpenDelete(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedModule) {
                  deleteModuleMutation.mutate(selectedModule.id, {
                    onSuccess: () => {
                      setOpenDelete(false);
                      setSelectedModule(null);
                      queryClient.invalidateQueries({
                        queryKey: [queryKeys.courses.modules(courseId)],
                      });
                    },
                  });
                }
              }}
              variant="contained"
              color="error"
            >
              {deleteModuleMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      {(() => {
        const getButtonLabel = () => {
          if (toggleModulePublishMutation.isPending) {
            return null;
          }
          return selectedModule?.isPublished ? "Unpublish" : "Publish";
        };

        const buttonLabel = getButtonLabel();

        return (
          <Dialog
            open={openPublishConfirm}
            onClose={() => setOpenPublishConfirm(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle>
              {selectedModule?.isPublished
                ? "Unpublish Module"
                : "Publish Module"}
            </DialogTitle>
            <DialogContent className="py-4">
              <Typography>
                Are you sure you want to{" "}
                <strong>
                  {selectedModule?.isPublished ? "unpublish" : "publish"}
                </strong>{" "}
                the module "{selectedModule?.title}"?
              </Typography>
              {selectedModule?.isPublished && (
                <Typography variant="body2" className="text-orange-600 mt-2">
                  Unpublishing this module will make it unavailable to enrolled
                  students.
                </Typography>
              )}
              <div className="mt-4 flex justify-end space-x-2 gap-2">
                <Button
                  onClick={() => setOpenPublishConfirm(false)}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedModule) {
                      toggleModulePublishMutation.mutate(
                        {
                          id: selectedModule.id,
                          isPublished: !selectedModule.isPublished,
                        },
                        {
                          onSuccess: () => {
                            setOpenPublishConfirm(false);
                            queryClient.invalidateQueries({
                              queryKey: [queryKeys.courses.modules(courseId)],
                            });
                            toast.success(
                              `Module ${
                                selectedModule.isPublished
                                  ? "unpublished"
                                  : "published"
                              } successfully`
                            );
                          },
                          onError: (error) => {
                            toast.error("Failed to update module status");
                            console.error(
                              "Error toggling module publish:",
                              error
                            );
                            setOpenPublishConfirm(false);
                          },
                        }
                      );
                    }
                  }}
                  variant="contained"
                  color={selectedModule?.isPublished ? "warning" : "success"}
                >
                  {toggleModulePublishMutation.isPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    buttonLabel
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
};

export default CourseDetails;
