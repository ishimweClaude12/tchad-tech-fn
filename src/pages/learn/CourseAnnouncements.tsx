import { useState } from "react";
import {
  useCourseAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "src/hooks/learn/useAnnouncementsApi";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  Public,
  AccessTime,
  Add,
  Close,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import AnnouncementForm, {
  type AnnouncementPayload,
} from "src/components/learn/forms/AnnouncementForm";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "src/hooks/useApi";
import { useAuth } from "@clerk/clerk-react";
import type { Announcement } from "src/types/Announcements.types";

const CourseAnnouncements = () => {
  const { courseId = "" } = useParams();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);
  const { userId: authorId } = useAuth();

  const {
    data: announcements,
    isLoading,
    error,
  } = useCourseAnnouncements(courseId);
  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();
  const deleteAnnouncementMutation = useDeleteAnnouncement();

  const handleCreateAnnouncement = async (payload: AnnouncementPayload) => {
    await createAnnouncementMutation.mutateAsync(payload);
    // Refetch announcements after successful creation
    queryClient.invalidateQueries({
      queryKey: queryKeys.announcements.detail(courseId),
    });
    setIsFormOpen(false);
  };

  const handleUpdateAnnouncement = async (payload: AnnouncementPayload) => {
    if (!editingAnnouncement?.id) return;
    await updateAnnouncementMutation.mutateAsync({
      id: editingAnnouncement.id,
      payload,
    });
    // Refetch announcements after successful update
    queryClient.invalidateQueries({
      queryKey: queryKeys.announcements.detail(courseId),
    });
    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!announcementToDelete?.id) return;
    await deleteAnnouncementMutation.mutateAsync(announcementToDelete.id);
    // Refetch announcements after successful deletion
    queryClient.invalidateQueries({
      queryKey: queryKeys.announcements.detail(courseId),
    });
    setDeleteConfirmOpen(false);
    setAnnouncementToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setAnnouncementToDelete(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert severity="error">
          Error loading announcements. Please try again later.
        </Alert>
      </div>
    );
  }

  if (!announcements?.data.announcements.length) {
    return (
      <div className="p-6">
        <Alert severity="info">No announcements available at the moment.</Alert>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "SUPPER_ADMIN":
        return "secondary";
      case "INSTRUCTOR":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Announcements
          </h1>
          <p className="text-gray-600">
            Stay updated with the latest news and updates
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          size="large"
          className="h-fit"
          onClick={() => setIsFormOpen(true)}
        >
          Create Announcement
        </Button>
      </div>

      {/* Create/Edit Announcement Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxHeight: "90vh",
              borderRadius: 2,
            },
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between border-b">
          <span className="text-xl font-semibold">
            {editingAnnouncement
              ? "Edit Announcement"
              : "Create New Announcement"}
          </span>
          <IconButton aria-label="close" onClick={handleFormClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AnnouncementForm
            authorId={authorId ?? ""}
            courses={[
              {
                id: courseId,
                name: "Selected Course",
              },
            ]}
            onSubmit={
              editingAnnouncement
                ? handleUpdateAnnouncement
                : handleCreateAnnouncement
            }
            onCancel={handleFormClose}
            initialData={
              editingAnnouncement
                ? {
                    courseId: editingAnnouncement.courseId,
                    title: editingAnnouncement.title,
                    content: editingAnnouncement.content,
                    isGlobal: editingAnnouncement.isGlobal,
                    isPublished: editingAnnouncement.isPublished,
                    expiresAt: editingAnnouncement.expiresAt || "",
                    authorId:
                      editingAnnouncement.author?.userId || authorId || "",
                  }
                : { courseId }
            }
            mode={editingAnnouncement ? "update" : "create"}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <Delete />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="text-gray-700 mb-2">
            Are you sure you want to delete this announcement?
          </Typography>
          {announcementToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <Typography
                variant="subtitle2"
                className="font-semibold text-gray-900 mb-1"
              >
                {announcementToDelete.title}
              </Typography>
              <Typography
                variant="body2"
                className="text-gray-600 line-clamp-2"
              >
                {announcementToDelete.content}
              </Typography>
            </div>
          )}
          <Alert severity="warning" className="mt-4">
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            disabled={deleteAnnouncementMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteAnnouncementMutation.isPending}
            startIcon={
              deleteAnnouncementMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                <Delete />
              )
            }
          >
            {deleteAnnouncementMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Announcements List */}
      <div className="space-y-4 max-w-5xl">
        {announcements.data.announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className="hover:shadow-lg transition-shadow duration-300"
            elevation={2}
          >
            <CardContent className="p-6">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Typography
                      variant="h5"
                      component="h2"
                      className="font-semibold text-gray-900"
                    >
                      {announcement.title}
                    </Typography>
                    {announcement.isGlobal && (
                      <Chip
                        icon={<Public className="text-sm" />}
                        label="Global"
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    )}
                    {!announcement.isPublished && (
                      <Chip
                        label="Draft"
                        size="small"
                        variant="outlined"
                        className="text-gray-600"
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <IconButton
                    onClick={() => handleEditClick(announcement)}
                    size="small"
                    className="text-blue-600 hover:bg-blue-50"
                    aria-label="edit announcement"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(announcement)}
                    size="small"
                    className="text-red-600 hover:bg-red-50"
                    aria-label="delete announcement"
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>

              {/* Content */}
              <Typography
                variant="body1"
                className="text-gray-700 mb-4 whitespace-pre-wrap"
              >
                {announcement.content}
              </Typography>

              {/* Footer Metadata */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 bg-blue-500">
                    <Person fontSize="small" />
                  </Avatar>
                  <Chip
                    label={announcement.author.role.replace("_", " ")}
                    size="small"
                    color={getRoleColor(announcement.author.role)}
                    variant="outlined"
                  />
                </div>

                {/* Published Date */}
                {announcement.publishedAt && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(announcement.publishedAt)}
                    </Typography>
                  </div>
                )}

                {/* Expiry Date */}
                {announcement.expiresAt && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">
                      Expires: {formatDate(announcement.expiresAt)}
                    </Typography>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseAnnouncements;
