import { useState } from "react";
import {
  useAnnouncements,
  useDeleteAnnouncement,
} from "src/hooks/learn/useAnnouncementsApi";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "src/hooks/useApi";
import type { Announcement } from "src/types/Announcements.types";

// MUI Components
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";

// Material Icons
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));

type RoleStyle = {
  chipColor: "error" | "secondary" | "primary" | "default";
  accentClass: string;
  avatarClass: string;
  label: string;
};

const getRoleStyle = (role: string): RoleStyle => {
  switch (role) {
    case "ADMIN":
      return {
        chipColor: "error",
        accentClass: "bg-rose-400",
        avatarClass: "bg-rose-100 text-rose-600",
        label: "Admin",
      };
    case "SUPPER_ADMIN":
      return {
        chipColor: "secondary",
        accentClass: "bg-purple-400",
        avatarClass: "bg-purple-100 text-purple-600",
        label: "Super Admin",
      };
    case "INSTRUCTOR":
      return {
        chipColor: "primary",
        accentClass: "bg-blue-400",
        avatarClass: "bg-blue-100 text-blue-600",
        label: "Instructor",
      };
    default:
      return {
        chipColor: "default",
        accentClass: "bg-gray-300",
        avatarClass: "bg-gray-100 text-gray-500",
        label: role,
      };
  }
};

// ─── Card ────────────────────────────────────────────────────────────────────
const AnnouncementCard = ({
  announcement,
  onDelete,
}: {
  announcement: Announcement;
  onDelete: (a: Announcement) => void;
}) => {
  const role = getRoleStyle(announcement.author.role);

  return (
    <Card
      variant="outlined"
      className="group overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-200"
      sx={{ borderRadius: 3, border: "1px solid", borderColor: "grey.100" }}
    >
      {/* Accent bar */}
      <div className={`h-1 w-full ${role.accentClass}`} />

      <CardContent sx={{ px: { xs: 3, sm: 3.5 }, py: { xs: 2.5, sm: 3 } }}>
        {/* Top row */}
        <Box className="flex items-start justify-between gap-4 mb-3">
          <Box className="flex-1 min-w-0">
            <Typography
              variant="h6"
              className="font-bold text-gray-900 wrap-break-words mb-2"
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, lineHeight: 1.4 }}
            >
              {announcement.title}
            </Typography>

            <Box className="flex flex-wrap items-center gap-1.5">
              <Chip
                label={role.label}
                color={role.chipColor}
                size="small"
                sx={{ fontWeight: 600, fontSize: "0.7rem" }}
              />
              {announcement.isGlobal && (
                <Chip
                  icon={<LanguageRoundedIcon sx={{ fontSize: "0.85rem" }} />}
                  label="Global"
                  size="small"
                  variant="outlined"
                  color="info"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
              {!announcement.isPublished && (
                <Chip
                  label="Draft"
                  size="small"
                  variant="outlined"
                  color="warning"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
            </Box>
          </Box>

          <Tooltip title="Delete announcement" arrow>
            <IconButton
              onClick={() => onDelete(announcement)}
              aria-label="Delete announcement"
              size="small"
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
              sx={{
                borderRadius: 2,
                "&:hover": { bgcolor: "error.50", color: "error.main" },
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content */}
        <Typography
          variant="body2"
          className="text-gray-600 whitespace-pre-wrap wrap-break-words mb-5"
          sx={{
            lineHeight: 1.75,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
          }}
        >
          {announcement.content}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Metadata */}
        <Box className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Box className="flex items-center gap-1.5 text-gray-400">
            <SchoolRoundedIcon sx={{ fontSize: "0.9rem" }} />
            <Typography
              variant="caption"
              className="truncate max-w-40 sm:max-w-xs wrap-break-words text-gray-400"
              title={announcement.course.title}
            >
              {announcement.course.title}
            </Typography>
          </Box>

          {announcement.publishedAt && (
            <Box className="flex items-center gap-1.5 text-gray-400">
              <CalendarTodayRoundedIcon sx={{ fontSize: "0.9rem" }} />
              <Typography
                variant="caption"
                className="whitespace-nowrap text-gray-400"
              >
                {formatDate(announcement.publishedAt)}
              </Typography>
            </Box>
          )}

          {announcement.expiresAt && (
            <Box className="flex items-center gap-1.5 text-amber-500">
              <AccessTimeRoundedIcon
                sx={{ fontSize: "0.9rem", color: "warning.main" }}
              />
              <Typography
                variant="caption"
                className="whitespace-nowrap text-amber-500"
              >
                Expires {formatDate(announcement.expiresAt)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// ─── Delete Dialog ────────────────────────────────────────────────────────────
const DeleteDialog = ({
  announcement,
  isPending,
  onConfirm,
  onCancel,
}: {
  announcement: Announcement;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Dialog
    open
    onClose={onCancel}
    maxWidth="xs"
    fullWidth
    slotProps={{
      backdrop: {
        sx: { backdropFilter: "blur(4px)", bgcolor: "rgba(17,24,39,0.4)" },
      },
    }}
    sx={{ borderRadius: 3, overflow: "hidden" }}
  >
    {/* Header */}
    <DialogTitle
      sx={{
        px: 3,
        pt: 3,
        pb: 2,
        borderBottom: "1px solid",
        borderColor: "grey.100",
      }}
    >
      <Box className="flex items-center gap-3">
        <Avatar
          sx={{ width: 36, height: 36, bgcolor: "error.50", borderRadius: 2 }}
        >
          <DeleteForeverRoundedIcon
            sx={{ fontSize: "1.1rem", color: "error.main" }}
          />
        </Avatar>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          Delete Announcement
        </Typography>
      </Box>
    </DialogTitle>

    {/* Body */}
    <DialogContent sx={{ px: 3, py: 2.5 }}>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Are you sure you want to permanently delete this announcement? This
        action cannot be undone.
      </Typography>

      {/* Preview */}
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", mb: 2 }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          className="wrap-break-words mb-1"
        >
          {announcement.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          className="line-clamp-2 wrap-break-words"
          display="block"
        >
          {announcement.content}
        </Typography>
      </Paper>

      {/* Warning */}
      <Alert
        severity="warning"
        icon={<WarningAmberRoundedIcon fontSize="small" />}
        sx={{ borderRadius: 2, fontSize: "0.75rem" }}
      >
        Once deleted, this announcement will be permanently removed and cannot
        be recovered.
      </Alert>
    </DialogContent>

    {/* Actions */}
    <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
      <Button
        onClick={onCancel}
        disabled={isPending}
        variant="outlined"
        color="inherit"
        fullWidth
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          color: "text.secondary",
          borderColor: "grey.300",
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        disabled={isPending}
        variant="contained"
        color="error"
        fullWidth
        startIcon={
          isPending ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            <DeleteOutlineRoundedIcon fontSize="small" />
          )
        }
        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
      >
        {isPending ? "Deleting…" : "Delete"}
      </Button>
    </DialogActions>
  </Dialog>
);

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const AnnouncementsSkeleton = () => (
  <Box className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card
        key={i}
        variant="outlined"
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        <Skeleton variant="rectangular" height={4} />
        <CardContent sx={{ px: 3.5, py: 3 }}>
          <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
          <Box className="flex gap-2 mb-3">
            <Skeleton variant="rounded" width={64} height={22} />
            <Skeleton variant="rounded" width={56} height={22} />
          </Box>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="75%" sx={{ mb: 2 }} />
          <Divider sx={{ mb: 2 }} />
          <Box className="flex gap-4">
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={100} />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const Announcements = () => {
  const queryClient = useQueryClient();
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);
  const { data: announcements, isLoading, error } = useAnnouncements();
  const deleteAnnouncementMutation = useDeleteAnnouncement();

  const handleDeleteConfirm = async () => {
    if (!announcementToDelete?.id) return;
    await deleteAnnouncementMutation.mutateAsync(announcementToDelete.id);
    queryClient.invalidateQueries({
      queryKey: queryKeys.announcements.list(1, 10),
    });
    setAnnouncementToDelete(null);
  };

  const list = announcements?.data.announcements ?? [];

  const getSubtitleText = () => {
    if (isLoading) return "";
    if (list.length > 0) {
      const pluralSuffix = list.length === 1 ? "" : "s";
      return `${list.length} announcement${pluralSuffix} · Stay up to date`;
    }
    return "No announcements yet";
  };

  return (
    <Box className="min-h-screen bg-gray-50/70">
      <Box className="mx-auto px-6 py-8 sm:py-12">
        {/* ── Page Header ─────────────────────────────────── */}
        <Box component="header" mb={{ xs: 4, sm: 5 }}>
          <Box className="flex items-center gap-3 mb-1">
            <Box className="w-1 h-7 rounded-full bg-blue-500 shrink-0" />
            <Box className="flex items-center gap-2">
              <CampaignRoundedIcon
                sx={{ color: "primary.main", fontSize: "1.75rem" }}
              />
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.025em",
                  fontSize: { xs: "1.5rem", sm: "1.875rem" },
                }}
              >
                Announcements
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ pl: "calc(0.25rem + 12px + 0.75rem)" }}
          >
            {getSubtitleText()}
          </Typography>
        </Box>

        {/* ── Loading ─────────────────────────────────────── */}
        {isLoading && <AnnouncementsSkeleton />}

        {/* ── Error ───────────────────────────────────────── */}
        {error && !isLoading && (
          <Alert severity="error" sx={{ borderRadius: 2, maxWidth: "42rem" }}>
            Error loading announcements. Please try again later.
          </Alert>
        )}

        {/* ── Empty State ─────────────────────────────────── */}
        {!isLoading && !error && list.length === 0 && (
          <Box className="text-center py-20">
            <InboxRoundedIcon
              sx={{ fontSize: "3rem", color: "text.disabled", mb: 1.5 }}
            />
            <Typography variant="body2" fontWeight={500} color="text.disabled">
              Nothing to see here yet.
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              display="block"
              mt={0.5}
            >
              New announcements will appear here when published.
            </Typography>
          </Box>
        )}

        {/* ── List ──────────────────────────────────────── */}
        {!isLoading && !error && list.length > 0 && (
          <Box className="space-y-4">
            {list.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onDelete={setAnnouncementToDelete}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ── Delete Dialog ───────────────────────────────── */}
      {announcementToDelete && (
        <DeleteDialog
          announcement={announcementToDelete}
          isPending={deleteAnnouncementMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setAnnouncementToDelete(null)}
        />
      )}
    </Box>
  );
};

export default Announcements;
