import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsApi } from "../../services/learn/Notifications";
import { queryKeys } from "../useApi";
import toast from "react-hot-toast";

export const useUserNotifications = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.notifications.user(userId),
    queryFn: async () => {
      const response = await NotificationsApi.getUserNotifications(userId);
      return response.success ? response.data.notifications : [];
    },
    enabled: !!userId,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationsApi.markNotificationAsRead(notificationId),
    onSuccess: () => {
      toast.success("Notification marked as read!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
    onError: (error) => {
      toast.error("Failed to mark notification as read. Please try again.");
      console.error("Mark notification as read error:", error);
    },
  });
};

export const useMarkAllNotificationsAsRead = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationsApi.markAllNotificationsAsRead(userId),
    onSuccess: () => {
      toast.success("All notifications marked as read!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.user(userId),
      });
    },
    onError: (error) => {
      toast.error(
        "Failed to mark all notifications as read. Please try again.",
      );
      console.error("Mark all notifications as read error:", error);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationsApi.deleteNotification(notificationId),
    onSuccess: () => {
      toast.success("Notification deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
    onError: (error) => {
      toast.error("Failed to delete notification. Please try again.");
      console.error("Delete notification error:", error);
    },
  });
};

export const useAllNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...queryKeys.notifications.all, page, limit],
    queryFn: async () => {
      const response = await NotificationsApi.getAllNotifications(page, limit);
      return response.success ? response.data.notifications : [];
    },
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Parameters<typeof NotificationsApi.sendNotification>[0],
    ) => NotificationsApi.sendNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
      toast.success("Notification sent successfully!");
    },
    onError: (error) => {
      toast.error("Failed to send notification. Please try again.");
      console.error("Send notification error:", error);
    },
  });
};
