import axiosInstance from "src/lib/axios";
import type { ApiResponse } from "src/types/Api.types";
import type {
  NotificationPayload,
  UserNotification,
} from "src/types/Notifications.types";

export const NotificationsApi = {
  getUserNotifications: async (userId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        notifications: UserNotification[];
      }>
    >(`/notifications/user/${userId}`);
    return data;
  },
  markNotificationAsRead: async (notificationId: string) => {
    const { data } = await axiosInstance.patch<
      ApiResponse<{
        success: boolean;
      }>
    >(`/notifications/${notificationId}/read`);
    return data;
  },
  markAllNotificationsAsRead: async (userId: string) => {
    const { data } = await axiosInstance.patch<
      ApiResponse<{
        success: boolean;
      }>
    >(`/notifications/user/${userId}/read/all`);
    return data;
  },
  deleteNotification: async (notificationId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{
        success: boolean;
      }>
    >(`/notifications/${notificationId}`);
    return data;
  },
  getAllNotifications: async (page: number = 1, limit: number = 20) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        notifications: UserNotification[];
      }>
    >(`/notifications?page=${page}&limit=${limit}`);
    return data;
  },
  sendNotification: async (payload: NotificationPayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{
        count: number;
      }>
    >(`/notifications/bulk`, payload);
    return data;
  },
};
