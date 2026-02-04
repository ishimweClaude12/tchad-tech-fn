import { useState } from "react";
import {
  useAnnouncements,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  Public,
  School,
  AccessTime,
  Delete,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "src/hooks/useApi";
import type { Announcement } from "src/types/Announcements.types";

const Announcements = () => {
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);
  const { data: announcements, isLoading, error } = useAnnouncements();
  const deleteAnnouncementMutation = useDeleteAnnouncement();

  const handleDeleteClick = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!announcementToDelete?.id) return;
    await deleteAnnouncementMutation.mutateAsync(announcementToDelete.id);
    queryClient.invalidateQueries({
      queryKey: queryKeys.announcements.list(1, 10),
    });
    setDeleteConfirmOpen(false);
    setAnnouncementToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setAnnouncementToDelete(null);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">
          Stay updated with the latest news and updates
        </p>
      </div>

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

                <IconButton
                  onClick={() => handleDeleteClick(announcement)}
                  size="small"
                  className="text-red-600 hover:bg-red-50"
                  aria-label="delete draft announcement"
                >
                  <Delete />
                </IconButton>
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

                {/* Course Info */}
                <div className="flex items-center gap-1 text-gray-600">
                  <School fontSize="small" />
                  <Typography variant="body2">
                    {announcement.course.title}
                  </Typography>
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
            Are you sure you want to delete this draft announcement?
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
    </div>
  );
};

export default Announcements;
