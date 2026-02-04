import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsApi } from "../../services/learn/Notifications";
import { queryKeys } from "../useApi";

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationsApi.markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.user(userId),
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationsApi.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
};

export const useAllNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: async () => {
      const response = await NotificationsApi.getAllNotifications();
      return response.success ? response.data.notifications : [];
    },
  });
};
