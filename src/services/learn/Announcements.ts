import axiosInstance from "src/lib/axios";
import type {
  Announcement,
  AnnouncementPayload,
} from "src/types/Announcements.types";
import type { ApiResponse, PaginationMeta } from "src/types/Api.types";

export const AnnouncementsApi = {
  // Fetch all announcements
  getAll: async (params?: { page?: number; limit?: number }) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        announcements: Announcement[];
        meta: PaginationMeta;
      }>
    >("/announcements", { params });
    return data;
  },

  // Fetch announcement by coursesApi
  getCourseAnnouncements: async (courseId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ announcements: Announcement[] }>
    >(`/announcements/course/${courseId}`);
    return data;
  },
  createAnnouncement: async (payload: AnnouncementPayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ announcement: Announcement }>
    >("/announcements", payload);
    return data;
  },
  updateAnnouncement: async (id: string, payload: AnnouncementPayload) => {
    // Exclude authorId from update payload
    const { authorId, ...updatePayload } = payload;
    console.warn("Updating announcement without authorId:", authorId);
    const { data } = await axiosInstance.put<
      ApiResponse<{ announcement: Announcement }>
    >(`/announcements/${id}`, updatePayload);
    return data;
  },
  deleteAnnouncement: async (id: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{ message: string }>
    >(`/announcements/${id}`);
    return data;
  },
  getGlobalAnnouncements: async () => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ announcements: Announcement[] }>
    >("/announcements/global");
    return data;
  },
};
