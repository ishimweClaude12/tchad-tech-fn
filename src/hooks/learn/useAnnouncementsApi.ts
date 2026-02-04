import { useMutation, useQuery } from "@tanstack/react-query";
import { AnnouncementsApi } from "src/services/learn/Announcements";
import { queryKeys } from "../useApi";
import toast from "react-hot-toast";
import type { AnnouncementPayload } from "src/types/Announcements.types";

export const useAnnouncements = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.announcements.list(page, limit),
    queryFn: () => AnnouncementsApi.getAll({ page, limit }),
    enabled: true,
  });
};

export const useCourseAnnouncements = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.announcements.detail(courseId),
    queryFn: () => AnnouncementsApi.getCourseAnnouncements(courseId),
    enabled: !!courseId,
  });
};

export const useCreateAnnouncement = () => {
  return useMutation({
    mutationFn: AnnouncementsApi.createAnnouncement,
    onError: (error: { response?: { data?: { message?: string } } }) => {
      console.error("Error creating announcement:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create announcement. Please try again.",
      );
    },
    onSuccess: () => {
      toast.success("Announcement created successfully!");
    },
  });
};

export const useUpdateAnnouncement = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AnnouncementPayload;
    }) => AnnouncementsApi.updateAnnouncement(id, payload),
    onError: (error: { response?: { data?: { message?: string } } }) => {
      console.error("Error updating announcement:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update announcement. Please try again.",
      );
    },
    onSuccess: () => {
      toast.success("Announcement updated successfully!");
    },
  });
};

export const useDeleteAnnouncement = () => {
  return useMutation({
    mutationFn: AnnouncementsApi.deleteAnnouncement,
    onError: (error: { response?: { data?: { message?: string } } }) => {
      console.error("Error deleting announcement:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete announcement. Please try again.",
      );
    },
    onSuccess: () => {
      toast.success("Announcement deleted successfully!");
    },
  });
};

export const useGlobalAnnouncements = () => {
  return useQuery({
    queryKey: queryKeys.announcements.global(),
    queryFn: () => AnnouncementsApi.getGlobalAnnouncements(),
    enabled: true,
  });
};
