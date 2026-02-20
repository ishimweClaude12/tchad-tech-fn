import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Slide,
  Typography,
  Divider,
} from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";
import {
  Close,
  Notifications,
  Circle,
  CheckCircle,
  Delete,
  NotificationsNone,
  DoneAll,
} from "@mui/icons-material";
import {
  useUserNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "src/hooks/learn/useNotificationsApi";
import { useAuth } from "@clerk/clerk-react";

// Brand colors
// primary:  #1e40af (blue)
// accent:   #f59e0b (gold)
// success:  #059669 (green)

// ─── Slide-up transition ──────────────────────────────────────────────────────

const SlideUp = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationsDialogProps {
  /** Controls whether the dialog is open */
  open: boolean;
  /** Call this to close the dialog */
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// ─── Animated top border ──────────────────────────────────────────────────────

const AnimatedTopBorder: React.FC = () => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background:
        "linear-gradient(90deg, #1e40af 0%, #2563eb 50%, #f59e0b 100%)",
      animation: "shimmer 3s infinite",
      backgroundSize: "200% 100%",
      "@keyframes shimmer": {
        "0%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "200% 0" },
      },
    }}
  />
);

// ─── Notification Item ────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  };
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
}) => (
  <Box
    onClick={() => {
      if (!notification.isRead) onRead(notification.id);
    }}
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      p: { xs: 2, sm: 2.5 },
      mb: 1.5,
      borderRadius: "12px",
      background: notification.isRead
        ? "rgba(243, 244, 246, 0.6)"
        : "rgba(219, 234, 254, 0.85)",
      borderLeft: notification.isRead
        ? "3px solid #d1d5db"
        : "3px solid #1e40af",
      cursor: notification.isRead ? "default" : "pointer",
      transition: "all 0.2s ease",
      border: notification.isRead
        ? "1px solid rgba(209,213,219,0.5)"
        : "1px solid rgba(30,64,175,0.25)",
      borderLeftWidth: "3px",
      "&:hover": {
        transform: "translateX(2px)",
        boxShadow: "0 4px 16px rgba(30, 64, 175, 0.12)",
      },
    }}
  >
    {/* Unread dot */}
    <Box sx={{ pt: 0.5, flexShrink: 0 }}>
      {notification.isRead ? (
        <CheckCircle sx={{ fontSize: 16, color: "#d1d5db" }} />
      ) : (
        <Circle sx={{ fontSize: 10, color: "#1e40af", mt: 0.75 }} />
      )}
    </Box>

    {/* Content */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: "#1f2937",
          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
          lineHeight: 1.4,
          mb: 0.5,
        }}
      >
        {notification.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#4b5563",
          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
          lineHeight: 1.6,
          mb: 0.75,
          wordBreak: "break-word",
        }}
      >
        {notification.message}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "#9ca3af", fontSize: "0.75rem" }}
      >
        {formatDate(notification.createdAt)}
      </Typography>
    </Box>

    {/* Delete */}
    <Tooltip title="Delete notification" arrow>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        size="small"
        sx={{
          flexShrink: 0,
          color: "#ef4444",
          background: "rgba(239, 68, 68, 0.08)",
          "&:hover": {
            background: "rgba(239, 68, 68, 0.18)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <Delete sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  </Box>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 10,
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, rgba(30,64,175,0.1), rgba(37,99,235,0.15))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(30,64,175,0.2)",
      }}
    >
      <NotificationsNone sx={{ fontSize: 36, color: "#1e40af" }} />
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 700, color: "#374151" }}>
      All caught up!
    </Typography>
    <Typography variant="body2" sx={{ color: "#9ca3af", textAlign: "center" }}>
      You have no notifications at the moment.
    </Typography>
  </Box>
);

// ─── Main Dialog Component ────────────────────────────────────────────────────

export const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  open,
  onClose,
}) => {
  const { userId } = useAuth();
  const { data: notifications = [] } = useUserNotifications(userId || "");
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead(userId || "");
  const { mutate: deleteNotification } = useDeleteNotification();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      slots={{ transition: SlideUp }}
      slotProps={{
        paper: {
          sx: {
            background:
              "linear-gradient(160deg, #eff6ff 0%, #dbeafe 40%, #e0e7ff 100%)",
            position: "relative",
            overflow: "hidden",
          },
        },
      }}
    >
      <AnimatedTopBorder />

      {/* ── Header ── */}
      <DialogTitle
        component="div"
        sx={{
          p: 0,
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
          boxShadow: "0 4px 20px rgba(30, 64, 175, 0.35)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2, sm: 2.5 },
            gap: 2,
          }}
        >
          {/* Left: icon + title + chip */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(255,255,255,0.15)",
                px: 2,
                py: 1,
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Notifications
                sx={{
                  color: "#dbeafe",
                  fontSize: { xs: 20, sm: 24 },
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.15)" },
                  },
                }}
              />
              <Typography
                sx={{
                  color: "#dbeafe",
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Notifications
              </Typography>
            </Box>

            <Chip
              label={`${unreadCount} unread`}
              size="small"
              sx={{
                background: "rgba(245,158,11,0.25)",
                color: "#fef3c7",
                fontWeight: 700,
                border: "1px solid rgba(245,158,11,0.4)",
                fontSize: "0.75rem",
              }}
            />
          </Box>

          {/* Right: mark all + close */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {hasUnread && (
              <Tooltip title="Mark all as read" arrow>
                <Button
                  onClick={() => markAllAsRead()}
                  size="small"
                  startIcon={<DoneAll sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                  sx={{
                    background: "rgba(255,255,255,0.92)",
                    color: "#1e40af",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 0.75 },
                    borderRadius: "20px",
                    border: "1px solid rgba(30,64,175,0.15)",
                    "&:hover": {
                      background: "#fff",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    },
                    transition: "all 0.2s ease",
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  Mark All Read
                </Button>
              </Tooltip>
            )}

            {/* Mobile-only icon for mark all */}
            {hasUnread && (
              <Tooltip title="Mark all as read" arrow>
                <IconButton
                  onClick={() => markAllAsRead()}
                  size="small"
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    background: "rgba(255,255,255,0.2)",
                    color: "#dbeafe",
                    "&:hover": { background: "rgba(255,255,255,0.3)" },
                  }}
                >
                  <DoneAll sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Close notifications" arrow>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: "#dbeafe",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    background: "rgba(255,255,255,0.25)",
                    transform: "rotate(90deg)",
                  },
                  transition: "all 0.3s ease",
                  p: { xs: "6px", sm: "8px" },
                }}
              >
                <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats bar */}
        <Box
          sx={{
            px: { xs: 2.5, sm: 4 },
            pb: 2,
            display: "flex",
            gap: 3,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "rgba(219,234,254,0.8)", fontSize: "0.8125rem" }}
          >
            <span style={{ color: "#fff", fontWeight: 700 }}>
              {notifications.length}
            </span>{" "}
            total
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(219,234,254,0.8)", fontSize: "0.8125rem" }}
          >
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>
              {unreadCount}
            </span>{" "}
            unread
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(219,234,254,0.8)", fontSize: "0.8125rem" }}
          >
            <span style={{ color: "#6ee7b7", fontWeight: 700 }}>
              {notifications.length - unreadCount}
            </span>{" "}
            read
          </Typography>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: "rgba(30,64,175,0.2)" }} />

      {/* ── Content ── */}
      <DialogContent
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.04)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(30,64,175,0.3)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(30,64,175,0.5)",
          },
        }}
      >
        <Box sx={{ maxWidth: 760, mx: "auto" }}>
          {notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Unread section */}
              {hasUnread && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 800,
                      color: "#1e40af",
                      letterSpacing: "0.12em",
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 1.5,
                    }}
                  >
                    🔔 Unread ({unreadCount})
                  </Typography>
                  {notifications
                    .filter((n) => !n.isRead)
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                </Box>
              )}

              {/* Read section */}
              {notifications.some((n) => n.isRead) && (
                <Box>
                  {hasUnread && (
                    <Divider
                      sx={{
                        mb: 2.5,
                        borderColor: "rgba(30,64,175,0.15)",
                        "&::before, &::after": {
                          borderColor: "rgba(30,64,175,0.15)",
                        },
                      }}
                    >
                      <Typography
                        variant="overline"
                        sx={{
                          fontWeight: 800,
                          color: "#9ca3af",
                          letterSpacing: "0.12em",
                          fontSize: "0.75rem",
                        }}
                      >
                        Earlier
                      </Typography>
                    </Divider>
                  )}
                  {!hasUnread && (
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 800,
                        color: "#9ca3af",
                        letterSpacing: "0.12em",
                        fontSize: "0.75rem",
                        display: "block",
                        mb: 1.5,
                      }}
                    >
                      ✓ Read ({notifications.length - unreadCount})
                    </Typography>
                  )}
                  {notifications
                    .filter((n) => n.isRead)
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
