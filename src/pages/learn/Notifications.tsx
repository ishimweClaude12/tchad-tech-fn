import { Bell, Plus, Clock, CheckCircle2, Circle } from "lucide-react";
import { useAllNotifications } from "src/hooks/learn/useNotificationsApi";
import { NotificationType } from "src/types/Notifications.types";
import UserCard from "src/components/learn/UserCard";

const Notifications = () => {
  const { data: notifications, isLoading, error } = useAllNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5";
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
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Error Loading Notifications
            </div>
            <p className="text-red-700">
              Unable to fetch notifications. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Manage all learner notifications
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            onClick={() => {
              // TODO: Open create notification modal/form
              console.log("Create new notification");
            }}
          >
            <Plus className="w-5 h-5" />
            Create Notification
          </button>
        </div>

        {/* Stats Bar */}
        {notifications && notifications.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">Unread</div>
              <div className="text-2xl font-bold text-blue-600">
                {notifications.filter((n) => !n.isRead).length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">Read</div>
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter((n) => n.isRead).length}
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg p-5 shadow-sm transition-all hover:shadow-md ${
                  !notification.isRead
                    ? "border-l-4 border-blue-500"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`p-2.5 rounded-full ${getNotificationColor(
                      notification.type,
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3
                        className={`font-semibold text-gray-900 ${
                          !notification.isRead ? "font-bold" : ""
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">{notification.message}</p>

                    {/* User Card */}
                    <div className="mb-3">
                      <UserCard userId={notification.userId} />
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {notification.type.replace(/_/g, " ")}
                      </span>

                      {notification.relatedType && (
                        <span className="text-gray-500">
                          Related: {notification.relatedType}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        {notification.isRead ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Read</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-600">Unread</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Notifications Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first notification to get started
            </p>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              onClick={() => {
                // TODO: Open create notification modal/form
                console.log("Create new notification");
              }}
            >
              <Plus className="w-5 h-5" />
              Create Notification
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
