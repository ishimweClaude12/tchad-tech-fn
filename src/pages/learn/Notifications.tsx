import { useState } from "react";
import { Bell, Plus, Clock, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button, Pagination } from "@mui/material";
import {
  useAllNotifications,
  useDeleteNotification,
} from "src/hooks/learn/useNotificationsApi";
import { NotificationType } from "src/types/Notifications.types";
import UserCard from "src/components/learn/UserCard";
import NotificationForm from "src/components/learn/forms/NotificationForm";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const {
    data: notifications,
    isLoading,
    error,
  } = useAllNotifications(page, limit);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const deleteNotificationMutation = useDeleteNotification();

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    switch (type) {
      case NotificationType.COURSE_UPDATE:
        return <Bell className={iconClass} />;
      case NotificationType.ASSIGNMENT_DUE:
        return <Clock className={iconClass} />;
      case NotificationType.QUIZ_AVAILABLE:
        return <Circle className={iconClass} />;
      case NotificationType.CERTIFICATE_EARNED:
        return <CheckCircle2 className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COURSE_UPDATE:
        return "bg-blue-100 text-blue-600";
      case NotificationType.ASSIGNMENT_DUE:
        return "bg-orange-100 text-orange-600";
      case NotificationType.QUIZ_AVAILABLE:
        return "bg-purple-100 text-purple-600";
      case NotificationType.CERTIFICATE_EARNED:
        return "bg-green-100 text-green-600";
      case NotificationType.REVIEW_REMINDER:
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-4 sm:mb-6"></div>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 sm:p-6 shadow-sm"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-20 sm:w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
            <div className="text-red-600 text-base sm:text-lg font-semibold mb-2">
              Error Loading Notifications
            </div>
            <p className="text-sm sm:text-base text-red-700">
              Unable to fetch notifications. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              Notifications
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage all learner(s) notifications
            </p>
          </div>
          <Button
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap text-sm sm:text-base shrink-0"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Create Notification</span>
            <span className="xs:hidden">Create</span>
          </Button>
        </div>

        {/* Stats Bar */}
        {notifications && notifications.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Total</div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                {notifications.length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">
                Unread
              </div>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {notifications.filter((n) => !n.isRead).length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Read</div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {notifications.filter((n) => n.isRead).length}
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {notifications && notifications.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg p-4 sm:p-5 shadow-sm transition-all hover:shadow-md ${
                  notification.isRead
                    ? "border-l-2 sm:border-l-4 border-transparent"
                    : "border-l-2 sm:border-l-4 border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`p-2 sm:p-2.5 rounded-full shrink-0 ${getNotificationColor(
                      notification.type,
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title and Actions Row */}
                    <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2">
                      <h3
                        className={`font-semibold text-sm sm:text-base text-gray-900 flex-1 min-w-0 ${
                          notification.isRead ? "" : "font-bold"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap hidden sm:inline">
                          {formatDate(notification.createdAt)}
                        </span>
                        <Button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          disabled={deleteNotificationMutation.isPending}
                          className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 min-w-0"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile timestamp */}
                    <span className="text-xs text-gray-500 block sm:hidden mb-2">
                      {formatDate(notification.createdAt)}
                    </span>

                    {/* Message */}
                    <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">
                      {notification.message}
                    </p>

                    {/* User Card */}
                    <div className="mb-2 sm:mb-3">
                      <UserCard userId={notification.userId} />
                    </div>

                    {/* Metadata - Responsive Layout */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="px-2 sm:px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                        {notification.type.toString().replaceAll("_", " ")}
                      </span>

                      {notification.relatedType && (
                        <span className="text-gray-500 hidden sm:inline">
                          Related:{" "}
                          {notification.relatedType
                            .toString()
                            .replaceAll("_", " ")}
                        </span>
                      )}

                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {notification.isRead ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                            <span className="text-green-600">Read</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                            <span className="text-blue-600">Unread</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Related Type - Mobile Only */}
                    {notification.relatedType && (
                      <div className="text-xs text-gray-500 mt-2 sm:hidden">
                        Related:{" "}
                        {notification.relatedType
                          .toString()
                          .replaceAll("_", " ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 sm:mt-6 bg-white rounded-lg p-3 sm:p-4 shadow-sm overflow-x-auto">
              <Pagination
                count={notifications.length < limit ? page : page + 1}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={0}
                boundaryCount={1}
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: { xs: "28px", sm: "32px" },
                    height: { xs: "28px", sm: "32px" },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 sm:p-12 text-center shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No Notifications Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Create your first notification to get started
            </p>
            <Button
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create Notification
            </Button>
          </div>
        )}
      </div>

      {/* Notification Form Modal */}
      <NotificationForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};

export default Notifications;
